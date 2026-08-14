import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { UserProfile, UserRole } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: 'User ID or Email parameter is required' }, { status: 400 });
    }

    let sql = `SELECT * FROM profiles WHERE `;
    const params: any[] = [];

    if (userId) {
      sql += `id = ? LIMIT 1`;
      params.push(userId);
    } else {
      sql += `email = ? LIMIT 1`;
      params.push(email!.toLowerCase().trim());
    }

    const profiles = await query<any[]>(sql, params);

    if (profiles.length === 0) {
      return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
    }

    const p = profiles[0];
    const user: UserProfile = {
      id: p.id,
      auth_user_id: p.auth_user_id,
      email: p.email,
      name: p.name,
      avatar_url: p.avatar_url || undefined,
      role: p.role as UserRole,
      status: p.status,
      created_at: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
      updated_at: p.updated_at ? new Date(p.updated_at).toISOString() : undefined,
      last_login: p.last_login ? new Date(p.last_login).toISOString() : undefined
    };

    // Fetch Active Membership from MySQL
    const activeMemberships = await query<any[]>(
      `SELECT m.*, plan.name as plan_name FROM memberships m
       LEFT JOIN membership_plans plan ON m.plan_id = plan.id
       WHERE m.user_id = ? AND m.status = 'active' AND m.end_date > NOW()
       ORDER BY m.end_date DESC LIMIT 1`,
      [user.id]
    );

    const membership = activeMemberships.length > 0 ? {
      id: activeMemberships[0].id,
      user_id: activeMemberships[0].user_id,
      plan_id: activeMemberships[0].plan_id,
      plan_name: activeMemberships[0].plan_name || 'Active Membership',
      status: activeMemberships[0].status,
      razorpay_customer_id: activeMemberships[0].razorpay_customer_id,
      razorpay_subscription_id: activeMemberships[0].razorpay_subscription_id,
      start_date: new Date(activeMemberships[0].start_date).toISOString(),
      end_date: new Date(activeMemberships[0].end_date).toISOString(),
      auto_renew: Boolean(activeMemberships[0].auto_renew),
      created_at: new Date(activeMemberships[0].created_at).toISOString()
    } : null;

    const isPremium = user.role === 'super_admin' || Boolean(membership);

    return NextResponse.json({
      success: true,
      user,
      membership,
      isPremium
    });
  } catch (error: any) {
    console.error('Error fetching auth session:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch session' }, { status: 500 });
  }
}
