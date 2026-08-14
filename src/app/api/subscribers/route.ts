import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 });
    }

    const subscriberId = `sub-${Date.now()}`;
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await query(
      `INSERT INTO subscribers (id, email, name, subscribed_at)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [subscriberId, email.toLowerCase().trim(), name || null, createdAt]
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Love Talk Podcast newsletter!'
    });
  } catch (error: any) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
  }
}
