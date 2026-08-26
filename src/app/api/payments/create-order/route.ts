import { POST as createOrderHandler } from '../../membership/create-order/route';

export const dynamic = 'force-dynamic';

export async function POST(request: any) {
  return createOrderHandler(request);
}
