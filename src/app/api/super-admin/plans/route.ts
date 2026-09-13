import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await query<any[]>(`SELECT * FROM membership_plans ORDER BY price ASC`);
    const formatted = plans.map(p => ({
      ...p,
      price: parseFloat(p.price),
      discounted_price: p.discounted_price ? parseFloat(p.discounted_price) : undefined,
      benefits: typeof p.benefits === 'string' ? JSON.parse(p.benefits) : (p.benefits || []),
      is_active: Boolean(p.is_active),
      is_featured: Boolean(p.is_featured)
    }));
    return NextResponse.json({ plans: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch membership plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, target_audience, price, discounted_price, billing_period, is_active, is_featured, badge, benefits, razorpay_plan_id } = body;

    if (!name || !slug || !price) {
      return NextResponse.json({ error: 'Name, slug, and price are required' }, { status: 400 });
    }

    const planId = `plan_${Date.now()}`;
    await query(
      `INSERT INTO membership_plans (id, name, slug, target_audience, price, discounted_price, billing_period, is_active, is_featured, badge, benefits, razorpay_plan_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        planId,
        name,
        slug.toLowerCase().trim(),
        target_audience || 'All Listeners',
        price,
        discounted_price || null,
        billing_period || 'year',
        is_active ?? true,
        is_featured ?? false,
        badge || null,
        JSON.stringify(benefits || []),
        razorpay_plan_id || null
      ]
    );

    return NextResponse.json({ success: true, message: 'Plan created successfully' });
  } catch (err: any) {
    console.error('Error creating plan:', err);
    return NextResponse.json({ error: err.message || 'Failed to create plan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, target_audience, price, discounted_price, billing_period, is_active, is_featured, badge, benefits, razorpay_plan_id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    await query(
      `UPDATE membership_plans SET
       name = COALESCE(?, name),
       slug = COALESCE(?, slug),
       target_audience = COALESCE(?, target_audience),
       price = COALESCE(?, price),
       discounted_price = COALESCE(?, discounted_price),
       billing_period = COALESCE(?, billing_period),
       is_active = COALESCE(?, is_active),
       is_featured = COALESCE(?, is_featured),
       badge = COALESCE(?, badge),
       benefits = COALESCE(?, benefits),
       razorpay_plan_id = COALESCE(?, razorpay_plan_id),
       updated_at = NOW()
       WHERE id = ?`,
      [
        name || null,
        slug ? slug.toLowerCase().trim() : null,
        target_audience || null,
        price || null,
        discounted_price || null,
        billing_period || null,
        is_active ?? null,
        is_featured ?? null,
        badge || null,
        benefits ? JSON.stringify(benefits) : null,
        razorpay_plan_id || null,
        id
      ]
    );

    return NextResponse.json({ success: true, message: 'Plan updated successfully' });
  } catch (err: any) {
    console.error('Error updating plan:', err);
    return NextResponse.json({ error: err.message || 'Failed to update plan' }, { status: 500 });
  }
}
