import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { 
  RAZORPAY_KEY_ID, 
  RAZORPAY_PLAN_ID_1, 
  RAZORPAY_PLAN_ID_2, 
  isRazorpayConfigured, 
  createRazorpaySubscription 
} from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const planInput = body.plan_id || body.planId;
    const userId = body.userId || body.user_id;

    if (!planInput || !userId) {
      return NextResponse.json({ success: false, error: 'plan_id and userId parameters are required' }, { status: 400 });
    }

    // 1. Verify User Profile exists in MySQL
    const userRows = await query<any[]>(
      `SELECT * FROM profiles WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
    }

    // 2. Resolve Plan ID (Tier 1 vs Tier 2)
    const tier1Id = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_TIER_1 || RAZORPAY_PLAN_ID_1 || 'plan_TUDEcZ2uLPWkYl';
    const tier2Id = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_TIER_2 || RAZORPAY_PLAN_ID_2 || 'plan_TUDCZ8dhD0OOmu';

    let razorpayPlanId = tier1Id;
    let dbSearchSlug = 'youth';

    if (
      planInput === 'tier_2' || 
      planInput === 'tier2' || 
      planInput === 'plan_2' || 
      planInput === 'professional' || 
      planInput === 'plan-professional' || 
      planInput === tier2Id
    ) {
      razorpayPlanId = tier2Id;
      dbSearchSlug = 'professional';
    }

    // Load official plan details directly from MySQL database
    const plans = await query<any[]>(
      `SELECT * FROM membership_plans WHERE slug = ? OR id = ? OR razorpay_plan_id = ? LIMIT 1`,
      [dbSearchSlug, planInput, razorpayPlanId]
    );

    const targetPlan = plans.length > 0 ? plans[0] : null;
    const officialPrice = targetPlan 
      ? (targetPlan.discounted_price ? parseFloat(targetPlan.discounted_price) : parseFloat(targetPlan.price))
      : (dbSearchSlug === 'professional' ? 399 : 99);

    const amountInPaisa = Math.round(officialPrice * 100);

    // 3. Create Razorpay Subscription via REST API (or mock ID in dev mode)
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
      subscription_id: subscriptionId,
      subscriptionId: subscriptionId,
      orderId: subscriptionId,
      amount: amountInPaisa,
      currency: targetPlan ? targetPlan.currency : 'INR',
      key: RAZORPAY_KEY_ID,
      keyId: RAZORPAY_KEY_ID,
      isConfigured: isRazorpayConfigured(),
      plan_id: razorpayPlanId,
      planId: razorpayPlanId,
      planName: targetPlan ? targetPlan.name : (dbSearchSlug === 'professional' ? 'Professional' : 'Youth'),
      planPrice: officialPrice
    });
  } catch (err: any) {
    console.error('Error creating Razorpay subscription:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to create subscription' }, { status: 500 });
  }
}
