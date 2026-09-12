import { POST as createSubscriptionHandler } from '../../razorpay/create-subscription/route';

export const dynamic = 'force-dynamic';

export async function POST(request: any) {
  return createSubscriptionHandler(request);
}
