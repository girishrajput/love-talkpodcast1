import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await query<any[]>(
      `SELECT setting_key, setting_value FROM site_settings`
    );

    const settings: Record<string, any> = {};
    rows.forEach((row) => {
      settings[row.setting_key] = typeof row.setting_value === 'string'
        ? JSON.parse(row.setting_value)
        : row.setting_value;
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch site settings' }, { status: 500 });
  }
}
