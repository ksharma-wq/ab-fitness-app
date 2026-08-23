import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { razorpay, isMockKey } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { planId } = await req.json();
    
    if (!planId) {
      return NextResponse.json({ message: 'Plan ID is required' }, { status: 400 });
    }
    
    const plan = await db.plan.findUnique({
      where: { id: planId }
    });
    
    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }
    
    const amountInPaise = plan.price * 100;
    
    if (isMockKey()) {
      // Mock / Sandbox Simulator logic
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(7)}`;
      
      await db.payment.create({
        data: {
          userId: (session.user as any).id,
          amount: plan.price,
          currency: 'INR',
          status: 'PENDING',
          razorpayOrderId: mockOrderId,
          description: `Subscription to ${plan.name} Plan`,
        }
      });
      
      return NextResponse.json({
        isMock: true,
        orderId: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        planName: plan.name,
      });
    }
    
    // Real Razorpay logic
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcptid_${(session.user as any).id.substring(0, 10)}`,
    });
    
    await db.payment.create({
      data: {
        userId: (session.user as any).id,
        amount: plan.price,
        currency: 'INR',
        status: 'PENDING',
        razorpayOrderId: order.id,
        description: `Subscription to ${plan.name} Plan`,
      }
    });
    
    return NextResponse.json({
      isMock: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
