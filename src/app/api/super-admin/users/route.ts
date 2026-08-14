import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await query<any[]>(
      `SELECT id, auth_user_id, email, name, avatar_url, role, status, created_at, updated_at, last_login
       FROM profiles ORDER BY created_at DESC`
    );

    const formattedUsers = users.map(u => ({
      ...u,
      created_at: u.created_at ? new Date(u.created_at).toISOString() : new Date().toISOString(),
      updated_at: u.updated_at ? new Date(u.updated_at).toISOString() : undefined,
      last_login: u.last_login ? new Date(u.last_login).toISOString() : undefined
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users from database' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, role, status, grantPremiumDays } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 1. Update Profile Role & Status in MySQL
    await query(
      `UPDATE profiles SET role = COALESCE(?, role), status = COALESCE(?, status), updated_at = ? WHERE id = ?`,
      [role || null, status || null, now, userId]
    );

    // 2. Grant Manual Premium Days if requested
    if (grantPremiumDays && Number(grantPremiumDays) > 0) {
      const plans = await query<any[]>(`SELECT id FROM membership_plans LIMIT 1`);
      const defaultPlanId = plans.length > 0 ? plans[0].id : 'plan-youth';

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + Number(grantPremiumDays));

      await query(
        `UPDATE memberships SET status = 'expired', updated_at = NOW() WHERE user_id = ? AND status = 'active'`,
        [userId]
      );

      const memId = `mem_manual_${Date.now()}`;
      await query(
        `INSERT INTO memberships (id, user_id, plan_id, status, start_date, end_date, auto_renew)
         VALUES (?, ?, ?, 'active', ?, ?, FALSE)`,
        [
          memId,
          userId,
          defaultPlanId,
          startDate.toISOString().slice(0, 19).replace('T', ' '),
          endDate.toISOString().slice(0, 19).replace('T', ' ')
        ]
      );
    }

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (err: any) {
    console.error('Error updating user role/membership:', err);
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 });
  }
}
