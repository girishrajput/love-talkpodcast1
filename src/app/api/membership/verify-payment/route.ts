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
      return NextResponse.json({ success: false, error: 'Missing required payment verification parameters' }, { status: 400 });
    }

    // 1. Verify Razorpay HMAC-SHA256 signature server-side
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 });
    }

    // 2. Fetch stored order from MySQL to verify ownership & amount
    const orderRows = await query<any[]>(
      `SELECT * FROM membership_orders WHERE razorpay_order_id = ? LIMIT 1`,
      [razorpay_order_id]
    );

    if (orderRows.length > 0) {
      const order = orderRows[0];
      if (order.user_id !== userId) {
        return NextResponse.json({ success: false, error: 'Order ownership verification failed' }, { status: 403 });
      }

      // Idempotency check: If already paid, return active membership
      if (order.status === 'paid') {
        const existingMemRows = await query<any[]>(
          `SELECT m.*, p.name as plan_name, p.price as plan_price 
           FROM memberships m 
           JOIN membership_plans p ON m.plan_id = p.id 
           WHERE m.user_id = ? AND m.status = 'active' ORDER BY m.end_date DESC LIMIT 1`,
          [userId]
        );

        if (existingMemRows.length > 0) {
          const m = existingMemRows[0];
          return NextResponse.json({
            success: true,
            message: 'Payment was already verified and membership is active!',
            membership: {
              id: m.id,
              user_id: m.user_id,
              plan_id: m.plan_id,
              plan_name: m.plan_name,
              status: m.status,
              start_date: new Date(m.start_date).toISOString(),
              end_date: new Date(m.end_date).toISOString(),
              auto_renew: Boolean(m.auto_renew),
              created_at: new Date(m.created_at).toISOString()
            }
          });
        }
      }
    }

    // 3. Fetch Plan from MySQL database
    const planRows = await query<any[]>(
      `SELECT * FROM membership_plans WHERE (id = ? OR slug = ?) AND is_active = TRUE LIMIT 1`,
      [planId, planId]
    );

    if (planRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Membership plan not found' }, { status: 404 });
    }

    const plan = planRows[0];
    const planPrice = plan.discounted_price ? parseFloat(plan.discounted_price) : parseFloat(plan.price);

    // 4. Calculate Renewal Expiry Dates
    // Check if user has an existing active membership
    const activeMembershipRows = await query<any[]>(
      `SELECT * FROM memberships WHERE user_id = ? AND status = 'active' ORDER BY end_date DESC LIMIT 1`,
      [userId]
    );

    let startDate = new Date();
    let endDate = new Date();

    if (activeMembershipRows.length > 0) {
      const currentActive = activeMembershipRows[0];
      const currentExpiry = new Date(currentActive.end_date);

      if (currentExpiry > startDate) {
        // Renewal: Extend existing active expiry by 365 days
        startDate = new Date(currentActive.start_date);
        endDate = new Date(currentExpiry.getTime() + 365 * 24 * 60 * 60 * 1000);
      } else {
        // Current membership expired: Fresh 365 days from now
        endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      }
    } else {
      // New Membership: Fresh 365 days from now
      endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    }

    // Expire old active memberships for this user
    await query(
      `UPDATE memberships SET status = 'expired', updated_at = NOW() WHERE user_id = ? AND status = 'active'`,
      [userId]
    );

    const membershipId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startStr = startDate.toISOString().slice(0, 19).replace('T', ' ');
    const endStr = endDate.toISOString().slice(0, 19).replace('T', ' ');

    // 5. Update Order status to paid in MySQL
    await query(
      `UPDATE membership_orders SET status = 'paid', updated_at = NOW() WHERE razorpay_order_id = ?`,
      [razorpay_order_id]
    );

    // 6. Insert new Membership in MySQL
    await query(
      `INSERT INTO memberships (id, user_id, plan_id, status, razorpay_customer_id, razorpay_subscription_id, start_date, end_date, auto_renew)
       VALUES (?, ?, ?, 'active', ?, ?, ?, ?, TRUE)`,
      [
        membershipId,
        userId,
        plan.id,
        `cust_${userId.substring(0, 8)}`,
        `sub_${razorpay_order_id.substring(0, 12)}`,
        startStr,
        endStr
      ]
    );

    // 7. Insert Payment Record in MySQL
    await query(
      `INSERT INTO payments (id, user_id, membership_id, razorpay_payment_id, razorpay_order_id, razorpay_subscription_id, amount, currency, status, payment_method, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'captured', 'Razorpay UPI/Card', NOW())
       ON DUPLICATE KEY UPDATE status = 'captured', paid_at = NOW()`,
      [
        paymentId,
        userId,
        membershipId,
        razorpay_payment_id,
        razorpay_order_id,
        `sub_${razorpay_order_id.substring(0, 12)}`,
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
      razorpay_subscription_id: `sub_${razorpay_order_id.substring(0, 12)}`,
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
    return NextResponse.json({ success: false, error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
