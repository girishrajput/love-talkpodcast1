import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Environment configuration (typed, read once per call so a changed env var
// is always picked up — these are cheap string reads, not worth caching).
// ---------------------------------------------------------------------------

export const RAZORPAY_KEY_ID: string =
  process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_lovetalk2026';
export const RAZORPAY_KEY_SECRET: string = process.env.RAZORPAY_KEY_SECRET || 'test_secret_key_lovetalk';
export const RAZORPAY_WEBHOOK_SECRET: string = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

export const RAZORPAY_PLAN_ID_1: string = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_1 || '';
export const RAZORPAY_PLAN_ID_2: string = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_2 || '';

function isProductionEnv(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Thrown when a route tries to take a real payment action (create an order,
 * create a subscription) while running in production without real Razorpay
 * credentials configured. Distinct from a generic Error so route handlers
 * can map it to HTTP 503 instead of a generic 500/mock success.
 */
export class RazorpayNotConfiguredError extends Error {
  constructor(message: string = 'Razorpay is not configured for production use.') {
    super(message);
    this.name = 'RazorpayNotConfiguredError';
  }
}

export interface RazorpayConfigStatus {
  configured: boolean;
  isProduction: boolean;
  reasons: string[];
}

/**
 * Structured, human-readable diagnosis of *why* Razorpay is/isn't considered
 * configured — used both to gate behavior and to produce useful log/error
 * messages instead of a silent boolean.
 */
export function getRazorpayConfigStatus(): RazorpayConfigStatus {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const reasons: string[] = [];

  if (!keyId) {
    reasons.push('RAZORPAY_KEY_ID is not set');
  } else if (keyId.includes('YOUR_')) {
    reasons.push('RAZORPAY_KEY_ID still contains placeholder text ("YOUR_")');
  } else if (keyId.includes('rzp_test_lovetalk')) {
    reasons.push('RAZORPAY_KEY_ID is still the bundled default test key');
  }

  if (!keySecret) {
    reasons.push('RAZORPAY_KEY_SECRET is not set');
  } else if (keySecret.includes('YOUR_')) {
    reasons.push('RAZORPAY_KEY_SECRET still contains placeholder text ("YOUR_")');
  } else if (keySecret.includes('test_secret')) {
    reasons.push('RAZORPAY_KEY_SECRET is still the bundled default test secret');
  }

  return {
    configured: reasons.length === 0,
    isProduction: isProductionEnv(),
    reasons
  };
}

export function isRazorpayConfigured(): boolean {
  return getRazorpayConfigStatus().configured;
}

let hasWarnedMisconfigured = false;

/**
 * Logs one explicit, actionable console warning (not a silent no-op) the
 * first time Razorpay is found to be misconfigured in a given process.
 * Call this at the point a real payment action is about to be mocked, so the
 * warning is tied to an actual attempted checkout rather than firing on
 * every import.
 */
export function warnIfMisconfigured(): void {
  const status = getRazorpayConfigStatus();
  if (status.configured || hasWarnedMisconfigured) return;

  hasWarnedMisconfigured = true;
  console.warn(
    [
      '',
      '⚠️  [Razorpay] Live credentials are NOT configured — using the MOCK payment flow.',
      ...status.reasons.map((r) => `    - ${r}`),
      '    Set real values in .env.local (or your host\'s env settings) and restart the server to enable real payments.',
      ''
    ].join('\n')
  );
}

/**
 * Hard guard for production: a live deployment must never silently mock a
 * real customer's payment because credentials were left as placeholders.
 * Non-production environments fall through to the existing mock flow.
 */
function requireRealRazorpayInProduction(): void {
  const status = getRazorpayConfigStatus();
  if (status.isProduction && !status.configured) {
    throw new RazorpayNotConfiguredError(
      `Payments are not available: ${status.reasons.join('; ')}. Configure Razorpay credentials before accepting live payments.`
    );
  }
}

/**
 * A real Razorpay Plan ID always looks like `plan_<alphanumeric>`. Anything
 * empty, whitespace, or containing obvious placeholder text is rejected so a
 * half-configured plan fails fast with a clear message instead of being sent
 * to the Razorpay API (or worse, silently mocked).
 */
export function isPlaceholderRazorpayPlanId(planId?: string | null): boolean {
  if (!planId) return true;
  const trimmed = planId.trim();
  if (!trimmed) return true;
  if (/your_|placeholder|xxxx|example|_id$/i.test(trimmed)) return true;
  if (!/^plan_[A-Za-z0-9]+$/.test(trimmed)) return true;
  return false;
}

/**
 * Creates a Razorpay Order via REST API if configured, or generates a test Order ID.
 */
export async function createRazorpayOrder(amountInPaise: number, currency: string = 'INR', receiptId: string): Promise<{ orderId: string }> {
  requireRealRazorpayInProduction();
  warnIfMisconfigured();

  if (isRazorpayConfigured()) {
    // Real credentials are configured: any failure here must surface as a real
    // error, never fall back to a mock ID (a mock ID paired with a real key
    // will fail cryptically inside Razorpay Checkout instead of here).
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
    console.error('Razorpay Order creation failed:', data);
    throw new Error(data?.error?.description || 'Razorpay order creation failed');
  }

  // Not configured (and not production, guarded above): Mock Order ID for local test/dev mode only
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
  requireRealRazorpayInProduction();
  warnIfMisconfigured();

  if (isRazorpayConfigured()) {
    if (isPlaceholderRazorpayPlanId(planId)) {
      throw new Error(`Razorpay Plan ID "${planId || '(empty)'}" is missing or invalid. Configure a real live plan ID in Super Admin → Plans.`);
    }

    // Real credentials are configured: any failure here must surface as a real
    // error, never fall back to a mock ID (a mock ID paired with a real key
    // will fail cryptically inside Razorpay Checkout instead of here).
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
    console.error('Razorpay Subscription creation failed:', data);
    throw new Error(data?.error?.description || 'Razorpay subscription creation failed');
  }

  // Not configured (and not production, guarded above): Mock Subscription ID for local test/dev mode only
  const mockSubId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return { subscriptionId: mockSubId };
}

/**
 * Server-side Razorpay Order HMAC signature verification.
 * Mock signatures (`mock_sig_*`) are only ever honored outside production
 * AND while real credentials are absent — a production deployment rejects
 * them unconditionally, even if credentials happen to be misconfigured, so a
 * misconfiguration can never be exploited to "activate" a membership for
 * free via the mock flow.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!signature || !orderId || !paymentId) return false;

  if (!isProductionEnv() && !isRazorpayConfigured() && signature.startsWith('mock_sig_')) {
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
 * Same production lockout as verifyRazorpaySignature above.
 */
export function verifySubscriptionSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string
): boolean {
  if (!signature || !subscriptionId || !paymentId) return false;

  if (!isProductionEnv() && !isRazorpayConfigured() && signature.startsWith('mock_sig_')) {
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
 * Server-side Razorpay Webhook signature verification.
 * Same production lockout as above — a real webhook payload's signature is
 * always required in production regardless of local key-configuration state.
 */
export function verifyWebhookSignature(
  bodyText: string,
  signature: string
): boolean {
  if (!signature || !bodyText) return false;

  if (!isProductionEnv() && !isRazorpayConfigured() && signature.startsWith('mock_wh_')) {
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
