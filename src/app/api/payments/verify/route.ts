import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateCardNumber } from '@/lib/razorpay';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = await req.json();
    
    if (!razorpay_order_id || !planId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    
    const payment = await db.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id, userId }
    });
    
    if (!payment) {
      return NextResponse.json({ message: 'Payment record not found' }, { status: 404 });
    }
    
    let isVerified = false;
    
    if (razorpay_order_id.startsWith('order_mock_')) {
      if (razorpay_signature === 'mock_signature') {
        isVerified = true;
      }
    } else {
      const secret = process.env.RAZORPAY_KEY_SECRET || 'secret';
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');
      
      if (expectedSignature === razorpay_signature) {
        isVerified = true;
      }
    }
    
    if (!isVerified) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }
    
    const plan = await db.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);
    
    const membership = await db.membership.create({
      data: {
        userId,
        planId,
        status: 'ACTIVE',
        cardNumber: generateCardNumber(),
        startDate,
        endDate,
        autoRenew: true,
      }
    });
    
    await db.payment.update({
      where: { id: payment.id },
      data: { 
        status: 'SUCCESS',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        membershipId: membership.id,
      }
    });
    
    return NextResponse.json({ message: 'Payment verified and membership activated', membership });
    
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
