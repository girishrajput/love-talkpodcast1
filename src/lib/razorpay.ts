import crypto from 'crypto';

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_lovetalk2026';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret_key_lovetalk';
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

export const RAZORPAY_PLAN_ID_1 = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_1 || 'plan_TUDEcZ2uLPWkYl';
export const RAZORPAY_PLAN_ID_2 = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_2 || 'plan_TUDCZ8dhD0OOmu';

export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  return Boolean(
    keyId &&
    keySecret &&
    !keyId.includes('YOUR_') &&
    !keyId.includes('rzp_test_lovetalk') &&
    !keySecret.includes('YOUR_') &&
    !keySecret.includes('test_secret')
  );
}

/**
 * Creates a Razorpay Order via REST API if configured, or generates a test Order ID.
 */
export async function createRazorpayOrder(amountInPaise: number, currency: string = 'INR', receiptId: string): Promise<{ orderId: string }> {
  if (isRazorpayConfigured()) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: receiptId,
          payment_capture: 1
        })
      });

      const data = await response.json();
      if (response.ok && data.id) {
        return { orderId: data.id };
      }
      console.warn('Razorpay REST API Order creation returned non-OK status:', data);
    } catch (err) {
      console.error('Failed to create Razorpay order via API, falling back to mock:', err);
    }
  }

  // Fallback / Mock Order ID for local test mode
  const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return { orderId: mockOrderId };
}

/**
 * Creates a Razorpay Subscription via REST API if configured, or generates a test Subscription ID.
 */
export async function createRazorpaySubscription(
  planId: string,
  totalCount: number = 12,
  customerNotify: number = 1
): Promise<{ subscriptionId: string }> {
  if (isRazorpayConfigured()) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          plan_id: planId,
          total_count: totalCount,
          quantity: 1,
          customer_notify: customerNotify
        })
      });

      const data = await response.json();
      if (response.ok && data.id) {
        return { subscriptionId: data.id };
      }
      console.warn('Razorpay Subscription creation returned non-OK status:', data);
    } catch (err) {
      console.error('Failed to create Razorpay subscription via API, falling back to mock:', err);
    }
  }

  // Fallback / Mock Subscription ID for local test mode
  const mockSubId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return { subscriptionId: mockSubId };
}

/**
 * Server-side Razorpay Order HMAC signature verification
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!signature || !orderId || !paymentId) return false;
  
  if (!isRazorpayConfigured() && signature.startsWith('mock_sig_')) {
    return true;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (err) {
    console.error('Razorpay signature verification error:', err);
    return false;
  }
}

/**
 * Server-side Razorpay Subscription HMAC signature verification
 * Formula: HMAC_SHA256(payment_id + "|" + subscription_id, secret)
 */
export function verifySubscriptionSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string
): boolean {
  if (!signature || !subscriptionId || !paymentId) return false;

  if (!isRazorpayConfigured() && signature.startsWith('mock_sig_')) {
    return true;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${paymentId}|${subscriptionId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (err) {
    console.error('Razorpay subscription signature verification error:', err);
    return false;
  }
}

/**
 * Server-side Razorpay Webhook signature verification
 */
export function verifyWebhookSignature(
  bodyText: string,
  signature: string
): boolean {
  if (!signature || !bodyText) return false;
  
  if (!isRazorpayConfigured() && signature.startsWith('mock_wh_')) {
    return true;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(bodyText)
      .digest('hex');

    return expectedSignature === signature;
  } catch (err) {
    console.error('Razorpay webhook signature verification error:', err);
    return false;
  }
}
