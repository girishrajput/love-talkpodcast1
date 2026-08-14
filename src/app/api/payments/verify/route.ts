import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { UserMembership, PaymentRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      userId, 
      planId 
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !planId) {
      return NextResponse.json({ error: 'Missing required payment verification parameters' }, { status: 400 });
    }

    // 1. Verify Razorpay cryptographic signature server-side
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // 2. Fetch Plan from MySQL
    const planRows = await query<any[]>(
      `SELECT * FROM membership_plans WHERE id = ? OR slug = ? LIMIT 1`,
      [planId, planId]
    );

    if (planRows.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const plan = planRows[0];
    const planPrice = plan.discounted_price ? parseFloat(plan.discounted_price) : parseFloat(plan.price);

    // 3. Expire existing active memberships for this user in MySQL
    await query(
      `UPDATE memberships SET status = 'expired', updated_at = NOW() WHERE user_id = ? AND status = 'active'`,
      [userId]
    );

    // 4. Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date();
    if (plan.billing_period === 'year') {
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    const membershipId = `mem_${Date.now()}`;
    const paymentId = `pay_${Date.now()}`;
    const startStr = startDate.toISOString().slice(0, 19).replace('T', ' ');
    const endStr = endDate.toISOString().slice(0, 19).replace('T', ' ');

    // 5. Insert new Membership in MySQL
    await query(
      `INSERT INTO memberships (id, user_id, plan_id, status, razorpay_customer_id, razorpay_subscription_id, start_date, end_date, auto_renew)
       VALUES (?, ?, ?, 'active', ?, ?, ?, ?, TRUE)`,
      [
        membershipId,
        userId,
        plan.id,
        `cust_${userId.substring(0, 8)}`,
        `sub_${razorpay_order_id.substring(0, 10)}`,
        startStr,
        endStr
      ]
    );

    // 6. Insert Payment Record in MySQL
    await query(
      `INSERT INTO payments (id, user_id, membership_id, razorpay_payment_id, razorpay_order_id, razorpay_subscription_id, amount, currency, status, payment_method, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'captured', 'Razorpay UPI/Card', NOW())`,
      [
        paymentId,
        userId,
        membershipId,
        razorpay_payment_id,
        razorpay_order_id,
        `sub_${razorpay_order_id.substring(0, 10)}`,
        planPrice,
        plan.currency || 'INR'
      ]
    );

    const newMembership: UserMembership = {
      id: membershipId,
      user_id: userId,
      plan_id: plan.id,
      plan_name: `${plan.name} Plan (₹${planPrice}/yr)`,
      status: 'active',
      razorpay_customer_id: `cust_${userId.substring(0, 8)}`,
      razorpay_subscription_id: `sub_${razorpay_order_id.substring(0, 10)}`,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      auto_renew: true,
      created_at: startDate.toISOString()
    };

    const newPayment: PaymentRecord = {
      id: paymentId,
      user_id: userId,
      membership_id: membershipId,
      razorpay_payment_id,
      razorpay_order_id,
      amount: planPrice,
      currency: plan.currency || 'INR',
      status: 'captured',
      payment_method: 'Razorpay UPI/Card',
      paid_at: startDate.toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Payment verified and Love Talk Premium membership activated!',
      membership: newMembership,
      payment: newPayment
    });
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
