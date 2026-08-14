import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RAZORPAY_KEY_ID } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

    if (!planId || !userId) {
      return NextResponse.json({ error: 'Plan ID and User ID are required' }, { status: 400 });
    }

    // Load official plan directly from MySQL database
    const plans = await query<any[]>(
      `SELECT * FROM membership_plans WHERE (id = ? OR slug = ?) AND is_active = TRUE LIMIT 1`,
      [planId, planId]
    );

    if (plans.length === 0) {
      return NextResponse.json({ error: 'Invalid or inactive membership plan' }, { status: 404 });
    }

    const targetPlan = plans[0];
    const officialPrice = targetPlan.discounted_price ? parseFloat(targetPlan.discounted_price) : parseFloat(targetPlan.price);
    const amountInPaisa = Math.round(officialPrice * 100);
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

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
    return NextResponse.json({ error: err.message || 'Failed to create payment order' }, { status: 500 });
  }
}
