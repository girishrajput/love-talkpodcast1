import crypto from 'crypto';

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_lovetalk2026';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret_key_lovetalk';
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/**
 * Server-side Razorpay HMAC signature verification
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!signature || !orderId || !paymentId) return false;
  
  // In dev / mock mode without secret set, accept valid test signatures
  if (!process.env.RAZORPAY_KEY_SECRET && signature.startsWith('mock_sig_')) {
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
 * Server-side Razorpay Webhook signature verification
 */
export function verifyWebhookSignature(
  bodyText: string,
  signature: string
): boolean {
  if (!signature || !bodyText) return false;
  
  if (!process.env.RAZORPAY_WEBHOOK_SECRET && signature.startsWith('mock_wh_')) {
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
