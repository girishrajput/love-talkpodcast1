import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  RAZORPAY_KEY_ID,
  RAZORPAY_PLAN_ID_1,
  RAZORPAY_PLAN_ID_2,
  isRazorpayConfigured,
  isPlaceholderRazorpayPlanId,
  createRazorpaySubscription,
  RazorpayNotConfiguredError
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

    // 2. Load the official plan directly from MySQL (source of truth for price AND Razorpay Plan ID)
    const plans = await query<any[]>(
      `SELECT * FROM membership_plans WHERE (id = ? OR slug = ?) AND is_active = TRUE LIMIT 1`,
      [planInput, planInput]
    );

    if (plans.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive membership plan' }, { status: 404 });
    }

    const targetPlan = plans[0];
    const officialPrice = targetPlan.discounted_price ? parseFloat(targetPlan.discounted_price) : parseFloat(targetPlan.price);
    const amountInPaisa = Math.round(officialPrice * 100);

    // 3. Resolve the Razorpay Plan ID: the plan's own `razorpay_plan_id` column
    // (set in Super Admin → Plans) is the source of truth. Legacy env-based
    // tier IDs are only used as a fallback for plans that predate that field.
    const tier1Id = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_TIER_1 || RAZORPAY_PLAN_ID_1;
    const tier2Id = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_TIER_2 || RAZORPAY_PLAN_ID_2;

    const razorpayPlanId: string =
      targetPlan.razorpay_plan_id ||
      (targetPlan.slug === 'professional' ? tier2Id : tier1Id);

    if (isPlaceholderRazorpayPlanId(razorpayPlanId)) {
      return NextResponse.json(
        {
          success: false,
          error: `Razorpay Plan ID for "${targetPlan.name}" is missing or looks like a placeholder ("${razorpayPlanId || 'empty'}"). Set the real live Plan ID for this plan in Super Admin → Plans before accepting subscriptions.`
        },
        { status: 400 }
      );
    }

    // 4. Create Razorpay Subscription via REST API (or mock ID in dev mode)
    const { subscriptionId } = await createRazorpaySubscription(razorpayPlanId);

    // 5. Store pending subscription order in MySQL membership_orders
    const internalOrderId = `sub_ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await query(
      `INSERT INTO membership_orders (id, user_id, plan_id, razorpay_order_id, amount, currency, status)
       VALUES (?, ?, ?, ?, ?, ?, 'created')
       ON DUPLICATE KEY UPDATE status = 'created', updated_at = NOW()`,
      [
        internalOrderId,
        userId,
        targetPlan.id,
        subscriptionId,
        officialPrice,
        targetPlan.currency || 'INR'
      ]
    );

    return NextResponse.json({
      success: true,
      subscription_id: subscriptionId,
      subscriptionId: subscriptionId,
      orderId: subscriptionId,
      amount: amountInPaisa,
      currency: targetPlan.currency || 'INR',
      key: RAZORPAY_KEY_ID,
      keyId: RAZORPAY_KEY_ID,
      isConfigured: isRazorpayConfigured(),
      plan_id: razorpayPlanId,
      planId: razorpayPlanId,
      planName: targetPlan.name,
      planPrice: officialPrice
    });
  } catch (err: any) {
    console.error('Error creating Razorpay subscription:', err);
    if (err instanceof RazorpayNotConfiguredError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 503 });
    }
    return NextResponse.json({ success: false, error: err.message || 'Failed to create subscription' }, { status: 502 });
  }
}
