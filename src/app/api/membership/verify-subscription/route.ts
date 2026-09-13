import { POST as verifySubscriptionHandler } from '../../razorpay/subscription/verify/route';

export const dynamic = 'force-dynamic';

export async function POST(request: any) {
  return verifySubscriptionHandler(request);
}
