import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // 1. Verify Razorpay Webhook HMAC signature
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid && process.env.NODE_ENV === 'production') {
      console.warn('[Razorpay Webhook Error] Invalid webhook signature detected');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody || '{}');
    const event = payload.event;
    const eventId = payload.event_id || payload.payload?.payment?.entity?.id || `wh_${Date.now()}`;

    // 2. Idempotency Check: Check if webhook event was already processed in MySQL
    const existingEvents = await query<any[]>(
      `SELECT * FROM webhook_events WHERE event_id = ? LIMIT 1`,
      [eventId]
    );

    if (existingEvents.length > 0 && existingEvents[0].processed) {
      console.log(`[Razorpay Webhook Ignored] Duplicate event ${eventId} already processed.`);
      return NextResponse.json({ status: 'already_processed', event_id: eventId });
    }

    // Insert or record webhook event in MySQL
    const webhookDbId = `wh_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await query(
      `INSERT INTO webhook_events (id, event_id, event_type, payload, processed)
       VALUES (?, ?, ?, ?, FALSE)
       ON DUPLICATE KEY UPDATE updated_at = NOW()`,
      [webhookDbId, eventId, event || 'unknown', JSON.stringify(payload)]
    );

    console.log(`[Razorpay Webhook Received] Event: ${event}, Event ID: ${eventId}`);

    // 3. Process Payment & Order Events
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity || {};
      const orderId = paymentEntity.order_id || payload.payload?.order?.entity?.id;
      const paymentId = paymentEntity.id || `pay_wh_${Date.now()}`;
      const amountPaid = paymentEntity.amount ? paymentEntity.amount / 100 : 0;

      if (orderId) {
        // Find matching pending order in membership_orders
        const orderRows = await query<any[]>(
          `SELECT * FROM membership_orders WHERE razorpay_order_id = ? LIMIT 1`,
          [orderId]
        );

        if (orderRows.length > 0) {
          const order = orderRows[0];

          if (order.status !== 'paid') {
            const userId = order.user_id;
            const planId = order.plan_id;

            // Fetch Plan details
            const planRows = await query<any[]>(
              `SELECT * FROM membership_plans WHERE id = ? LIMIT 1`,
              [planId]
            );

            if (planRows.length > 0) {
              const plan = planRows[0];
              const planPrice = amountPaid || (plan.discounted_price ? parseFloat(plan.discounted_price) : parseFloat(plan.price));

              // Compute renewal expiry date
              const activeMembershipRows = await query<any[]>(
                `SELECT * FROM memberships WHERE user_id = ? AND status = 'active' ORDER BY end_date DESC LIMIT 1`,
                [userId]
              );

              let startDate = new Date();
              let endDate = new Date();

              if (activeMembershipRows.length > 0) {
                const currentExpiry = new Date(activeMembershipRows[0].end_date);
                if (currentExpiry > startDate) {
                  startDate = new Date(activeMembershipRows[0].start_date);
                  endDate = new Date(currentExpiry.getTime() + 365 * 24 * 60 * 60 * 1000);
                } else {
                  endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
                }
              } else {
                endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
              }

              // Update order status to paid
              await query(
                `UPDATE membership_orders SET status = 'paid', updated_at = NOW() WHERE razorpay_order_id = ?`,
                [orderId]
              );

              // Expire old active memberships
              await query(
                `UPDATE memberships SET status = 'expired', updated_at = NOW() WHERE user_id = ? AND status = 'active'`,
                [userId]
              );

              // Create new active membership
              const memId = `mem_wh_${Date.now()}`;
              const startStr = startDate.toISOString().slice(0, 19).replace('T', ' ');
              const endStr = endDate.toISOString().slice(0, 19).replace('T', ' ');

              await query(
                `INSERT INTO memberships (id, user_id, plan_id, status, razorpay_customer_id, razorpay_subscription_id, start_date, end_date, auto_renew)
                 VALUES (?, ?, ?, 'active', ?, ?, ?, ?, TRUE)`,
                [memId, userId, plan.id, `cust_${userId.substring(0, 8)}`, `sub_${orderId.substring(0, 12)}`, startStr, endStr]
              );

              // Insert payment record
              const payDbId = `pay_wh_${Date.now()}`;
              await query(
                `INSERT INTO payments (id, user_id, membership_id, razorpay_payment_id, razorpay_order_id, razorpay_subscription_id, amount, currency, status, payment_method, paid_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'captured', 'Razorpay Webhook', NOW())
                 ON DUPLICATE KEY UPDATE status = 'captured', paid_at = NOW()`,
                [payDbId, userId, memId, paymentId, orderId, `sub_${orderId.substring(0, 12)}`, planPrice, plan.currency || 'INR']
              );

              console.log(`[Razorpay Webhook Activated] Membership activated for user ${userId} via Webhook.`);
            }
          }
        }
      }
    }

    // 4. Mark Webhook event as processed in MySQL
    await query(
      `UPDATE webhook_events SET processed = TRUE WHERE event_id = ?`,
      [eventId]
    );

    return NextResponse.json({ status: 'success', event_received: event, event_id: eventId });
  } catch (err: any) {
    console.error('[Razorpay Webhook Failed]:', err);
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}
