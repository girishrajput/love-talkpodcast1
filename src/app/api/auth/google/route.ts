import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { UserProfile, UserRole } from '@/lib/types';

export const dynamic = 'force-dynamic';

const INITIAL_SUPER_ADMIN_EMAIL = process.env.INITIAL_SUPER_ADMIN_EMAIL || 'superadmin@lovetalkpodcast.in';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, avatar_url, google_id } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required for authentication' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const authUserId = google_id || `google_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
    const displayName = name || cleanEmail.split('@')[0];
    const avatar = avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 1. Check if user profile exists in MySQL by email or auth_user_id
    const existingProfiles = await query<any[]>(
      `SELECT * FROM profiles WHERE email = ? OR auth_user_id = ? LIMIT 1`,
      [cleanEmail, authUserId]
    );

    let profile: UserProfile;

    if (existingProfiles.length > 0) {
      const existing = existingProfiles[0];
      await query(
        `UPDATE profiles SET 
          name = COALESCE(?, name), 
          avatar_url = COALESCE(?, avatar_url), 
          last_login = ?, 
          updated_at = ? 
         WHERE id = ?`,
        [displayName, avatar, now, now, existing.id]
      );

      profile = {
        id: existing.id,
        auth_user_id: existing.auth_user_id || authUserId,
        email: existing.email || cleanEmail,
        name: displayName || existing.name,
        avatar_url: avatar || existing.avatar_url,
        role: existing.role as UserRole,
        status: existing.status || 'active',
        created_at: existing.created_at ? new Date(existing.created_at).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
    } else {
      // Determine initial role
      const role: UserRole = cleanEmail === INITIAL_SUPER_ADMIN_EMAIL.toLowerCase() ? 'super_admin' : 'user';
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      await query(
        `INSERT INTO profiles (id, auth_user_id, email, name, avatar_url, role, status, created_at, updated_at, last_login)
         VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
          name = VALUES(name), 
          avatar_url = VALUES(avatar_url), 
          last_login = VALUES(last_login)`,
        [userId, authUserId, cleanEmail, displayName, avatar, role, now, now, now]
      );

      profile = {
        id: userId,
        auth_user_id: authUserId,
        email: cleanEmail,
        name: displayName,
        avatar_url: avatar,
        role,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
    }

    // 2. Fetch Active Membership for User from MySQL
    const activeMemberships = await query<any[]>(
      `SELECT m.*, p.name as plan_name FROM memberships m
       LEFT JOIN membership_plans p ON m.plan_id = p.id
       WHERE m.user_id = ? AND m.status = 'active' AND m.end_date > NOW()
       ORDER BY m.end_date DESC LIMIT 1`,
      [profile.id]
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

    const isPremium = profile.role === 'super_admin' || Boolean(membership);

    return NextResponse.json(
      {
        success: true,
        user: profile,
        membership,
        isPremium
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  } catch (error: any) {
    console.error('Google OAuth API error in MySQL:', error);
    return NextResponse.json({ success: false, error: error.message || 'Google authentication failed' }, { status: 500 });
  }
}
