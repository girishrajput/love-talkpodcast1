import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const benefits = await query<any[]>(`SELECT * FROM premium_benefits ORDER BY sort_order ASC`);
    const formatted = benefits.map(b => ({
      ...b,
      is_enabled: Boolean(b.is_enabled),
      plans: typeof b.plans === 'string' ? JSON.parse(b.plans) : (b.plans || [])
    }));
    return NextResponse.json({ benefits: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch benefits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, icon, is_enabled, sort_order, plans } = body;

    if (!title) {
      return NextResponse.json({ error: 'Benefit title is required' }, { status: 400 });
    }

    const benefitId = `benefit_${Date.now()}`;
    await query(
      `INSERT INTO premium_benefits (id, title, description, icon, is_enabled, sort_order, plans)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        benefitId,
        title,
        description || 'Included with all Love Talk Premium Subscriptions.',
        icon || 'Sparkles',
        is_enabled ?? true,
        sort_order || 0,
        JSON.stringify(plans || ['youth', 'professional'])
      ]
    );

    return NextResponse.json({ success: true, message: 'Benefit added successfully' });
  } catch (err: any) {
    console.error('Error creating benefit:', err);
    return NextResponse.json({ error: err.message || 'Failed to add benefit' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, icon, is_enabled, sort_order, plans } = body;

    if (!id) {
      return NextResponse.json({ error: 'Benefit ID is required' }, { status: 400 });
    }

    await query(
      `UPDATE premium_benefits SET
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       icon = COALESCE(?, icon),
       is_enabled = COALESCE(?, is_enabled),
       sort_order = COALESCE(?, sort_order),
       plans = COALESCE(?, plans)
       WHERE id = ?`,
      [
        title || null,
        description || null,
        icon || null,
        is_enabled ?? null,
        sort_order ?? null,
        plans ? JSON.stringify(plans) : null,
        id
      ]
    );

    return NextResponse.json({ success: true, message: 'Benefit updated successfully' });
  } catch (err: any) {
    console.error('Error updating benefit:', err);
    return NextResponse.json({ error: err.message || 'Failed to update benefit' }, { status: 500 });
  }
}
