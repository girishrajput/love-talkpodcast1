import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RAZORPAY_KEY_ID, createRazorpayOrder } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

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

    // 2. Load official plan directly from MySQL database (never trust price sent from client)
    const plans = await query<any[]>(
      `SELECT * FROM membership_plans WHERE (id = ? OR slug = ?) AND is_active = TRUE LIMIT 1`,
      [planId, planId]
    );

    if (plans.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive membership plan' }, { status: 404 });
    }

    const targetPlan = plans[0];
    const officialPrice = targetPlan.discounted_price ? parseFloat(targetPlan.discounted_price) : parseFloat(targetPlan.price);
    const amountInPaisa = Math.round(officialPrice * 100);

    // 3. Create Razorpay order (or test order ID)
    const receiptId = `rcpt_${userId.substring(0, 8)}_${Date.now()}`;
    const { orderId } = await createRazorpayOrder(amountInPaisa, targetPlan.currency || 'INR', receiptId);

    // 4. Store pending order in MySQL membership_orders table
    const internalOrderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await query(
      `INSERT INTO membership_orders (id, user_id, plan_id, razorpay_order_id, amount, currency, status)
       VALUES (?, ?, ?, ?, ?, ?, 'created')
       ON DUPLICATE KEY UPDATE status = 'created', updated_at = NOW()`,
      [
        internalOrderId,
        userId,
        targetPlan.id,
        orderId,
        officialPrice,
        targetPlan.currency || 'INR'
      ]
    );

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountInPaisa,
      currency: targetPlan.currency || 'INR',
      keyId: RAZORPAY_KEY_ID,
      planName: targetPlan.name,
      planPrice: officialPrice
    });
  } catch (err: any) {
    console.error('Error creating payment order:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to create payment order' }, { status: 500 });
  }
}
