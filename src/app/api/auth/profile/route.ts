import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, avatar_url } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await query(
      `UPDATE profiles SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url), updated_at = ? WHERE id = ?`,
      [name || null, avatar_url || null, now, userId]
    );

    const updated = await query<any[]>(`SELECT * FROM profiles WHERE id = ? LIMIT 1`, [userId]);

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const p = updated[0];
    return NextResponse.json({
      success: true,
      user: {
        id: p.id,
        auth_user_id: p.auth_user_id,
        email: p.email,
        name: p.name,
        avatar_url: p.avatar_url,
        role: p.role,
        status: p.status,
        created_at: new Date(p.created_at).toISOString(),
        updated_at: new Date(p.updated_at).toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
