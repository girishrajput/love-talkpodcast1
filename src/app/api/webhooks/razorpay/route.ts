import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // Verify Razorpay Webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody || '{}');
    const event = payload.event;

    console.log(`[Razorpay Webhook Received] Event: ${event}, ID: ${payload.payload?.payment?.entity?.id || 'N/A'}`);

    switch (event) {
      case 'payment.captured':
        // Handle captured payment
        break;
      case 'subscription.activated':
        // Handle subscription activation
        break;
      case 'subscription.halted':
      case 'subscription.cancelled':
        // Handle cancellation
        break;
      default:
        break;
    }

    return NextResponse.json({ status: 'success', event_received: event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}
