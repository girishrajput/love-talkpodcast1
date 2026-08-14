import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MembershipPlan, PremiumBenefit } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch Membership Plans
    const planRows = await query<any[]>(
      `SELECT * FROM membership_plans WHERE is_active = TRUE ORDER BY price ASC`
    );

    const plans: MembershipPlan[] = planRows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      target_audience: row.target_audience,
      price: parseFloat(row.price),
      currency: row.currency || 'INR',
      billing_period: row.billing_period || 'year',
      discounted_price: row.discounted_price ? parseFloat(row.discounted_price) : undefined,
      is_active: Boolean(row.is_active),
      is_featured: Boolean(row.is_featured),
      badge: row.badge || undefined,
      benefits: typeof row.benefits === 'string' ? JSON.parse(row.benefits) : (row.benefits || []),
      razorpay_plan_id: row.razorpay_plan_id || undefined,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    }));

    // 2. Fetch Premium Benefits
    const benefitRows = await query<any[]>(
      `SELECT * FROM premium_benefits WHERE is_enabled = TRUE ORDER BY sort_order ASC`
    );

    const benefits: PremiumBenefit[] = benefitRows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      icon: row.icon || 'Sparkles',
      is_enabled: Boolean(row.is_enabled),
      sort_order: row.sort_order || 0,
      plans: typeof row.plans === 'string' ? JSON.parse(row.plans) : (row.plans || []),
    }));

    return NextResponse.json({
      success: true,
      plans,
      benefits
    });
  } catch (error: any) {
    console.error('Error fetching membership plans:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch membership plans' }, { status: 500 });
  }
}
