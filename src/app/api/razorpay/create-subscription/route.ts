import { POST as createSubscriptionHandler } from '../subscription/create/route';

export const dynamic = 'force-dynamic';

export async function POST(request: any) {
  return createSubscriptionHandler(request);
}
