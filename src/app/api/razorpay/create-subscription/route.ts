import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RAZORPAY_KEY_ID, RAZORPAY_PLAN_ID_1, RAZORPAY_PLAN_ID_2, isRazorpayConfigured, createRazorpaySubscription } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId } = body;

    if (!planId || !userId) {
      return NextResponse.json({ success: false, error: 'Plan ID and User ID are required' }, { status: 400 });
    }

    // 1. Verify User Profile exists in MySQL
    const userRows = await query<any[]>(
      `SELECT * FROM profiles WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
    }

    // 2. Determine actual Razorpay Plan ID (Plan 1 vs Plan 2)
    let razorpayPlanId = RAZORPAY_PLAN_ID_1;
    let dbSearchSlug = 'youth';

    if (
      planId === 'plan_2' || 
      planId === 'professional' || 
      planId === 'plan-professional' || 
      planId === RAZORPAY_PLAN_ID_2
    ) {
      razorpayPlanId = RAZORPAY_PLAN_ID_2;
      dbSearchSlug = 'professional';
    }

    // Load official plan details directly from MySQL database
    const plans = await query<any[]>(
      `SELECT * FROM membership_plans WHERE slug = ? OR id = ? OR razorpay_plan_id = ? LIMIT 1`,
      [dbSearchSlug, planId, razorpayPlanId]
    );

    const targetPlan = plans.length > 0 ? plans[0] : null;
    const officialPrice = targetPlan 
      ? (targetPlan.discounted_price ? parseFloat(targetPlan.discounted_price) : parseFloat(targetPlan.price))
      : (dbSearchSlug === 'professional' ? 399 : 99);

    const amountInPaisa = Math.round(officialPrice * 100);

    // 3. Create Razorpay Subscription via API (or mock ID in dev)
    const { subscriptionId } = await createRazorpaySubscription(razorpayPlanId);

    // 4. Store pending subscription order in MySQL membership_orders
    const internalOrderId = `sub_ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await query(
      `INSERT INTO membership_orders (id, user_id, plan_id, razorpay_order_id, amount, currency, status)
       VALUES (?, ?, ?, ?, ?, ?, 'created')
       ON DUPLICATE KEY UPDATE status = 'created', updated_at = NOW()`,
      [
        internalOrderId,
        userId,
        targetPlan ? targetPlan.id : (dbSearchSlug === 'professional' ? 'plan-professional' : 'plan-youth'),
        subscriptionId,
        officialPrice,
        targetPlan ? targetPlan.currency : 'INR'
      ]
    );

    return NextResponse.json({
      success: true,
      subscriptionId,
      orderId: subscriptionId,
      amount: amountInPaisa,
      currency: targetPlan ? targetPlan.currency : 'INR',
      keyId: RAZORPAY_KEY_ID,
      isConfigured: isRazorpayConfigured(),
      planId: razorpayPlanId,
      planName: targetPlan ? targetPlan.name : (dbSearchSlug === 'professional' ? 'Professional' : 'Youth'),
      planPrice: officialPrice
    });
  } catch (err: any) {
    console.error('Error creating subscription order:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to create subscription order' }, { status: 500 });
  }
}
