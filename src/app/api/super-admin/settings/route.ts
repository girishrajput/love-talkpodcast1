import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await query<any[]>(`SELECT setting_key, setting_value FROM site_settings`);
    const settings: Record<string, any> = {};
    rows.forEach(r => {
      settings[r.setting_key] = typeof r.setting_value === 'string'
        ? JSON.parse(r.setting_value)
        : r.setting_value;
    });
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key = 'general', value } = body;

    if (!value) {
      return NextResponse.json({ error: 'Settings payload value is required' }, { status: 400 });
    }

    await query(
      `INSERT INTO site_settings (setting_key, setting_value, updated_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
      [key, JSON.stringify(value)]
    );

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (err: any) {
    console.error('Error saving settings:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
