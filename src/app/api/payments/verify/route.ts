import { POST as verifyHandler } from '../../membership/verify-payment/route';

export const dynamic = 'force-dynamic';

export async function POST(request: any) {
  return verifyHandler(request);
}
