import { NextRequest, NextResponse } from 'next/server';

// Stripe Checkout Session API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, userId, successUrl, cancelUrl } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Price IDs for different plans
    const validPriceIds = {
      'price_catalyst': { name: 'Catalyst', amount: 1999, interval: 'month' },
      'price_strategist': { name: 'Strategist', amount: 9999, interval: 'month' },
      'price_visionary': { name: 'Visionary', amount: 19999, interval: 'month' },
      'price_catalyst_annual': { name: 'Catalyst Annual', amount: 19990, interval: 'year' },
      'price_strategist_annual': { name: 'Strategist Annual', amount: 99990, interval: 'year' },
      'price_visionary_annual': { name: 'Visionary Annual', amount: 199990, interval: 'year' }
    };

    const priceInfo = validPriceIds[priceId as keyof typeof validPriceIds];

    if (!priceInfo) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // In production with Stripe:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    //   cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    //   customer_email: userEmail,
    //   metadata: { userId },
    //   subscription_data: { trial_period_days: 14 }
    // });

    // Demo checkout session
    const sessionId = `cs_demo_${Date.now()}`;
    const checkoutUrl = `/billing/checkout?session=${sessionId}&plan=${priceInfo.name}`;

    return NextResponse.json({
      success: true,
      sessionId,
      checkoutUrl,
      plan: priceInfo,
      demo: {
        note: 'In production, this redirects to Stripe Checkout',
        stripeCheckoutUrl: 'https://checkout.stripe.com/...'
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Handle Stripe webhook events
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // In production, verify Stripe signature:
    // const sig = request.headers.get('stripe-signature');
    // const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event) {
      case 'checkout.session.completed':
        // Upgrade user's plan
        return handleCheckoutComplete(data);

      case 'customer.subscription.updated':
        // Handle plan changes
        return handleSubscriptionUpdate(data);

      case 'customer.subscription.deleted':
        // Downgrade to free plan
        return handleSubscriptionCanceled(data);

      case 'invoice.payment_failed':
        // Handle failed payment
        return handlePaymentFailed(data);

      default:
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(data: any) {
  // Update user's subscription in database
  const { userId, planId, subscriptionId } = data;

  return NextResponse.json({
    success: true,
    message: 'Subscription activated',
    userId,
    planId,
    subscriptionId
  });
}

async function handleSubscriptionUpdate(data: any) {
  const { subscriptionId, newPlanId } = data;

  return NextResponse.json({
    success: true,
    message: 'Subscription updated',
    subscriptionId,
    newPlanId
  });
}

async function handleSubscriptionCanceled(data: any) {
  const { subscriptionId, userId } = data;

  return NextResponse.json({
    success: true,
    message: 'Subscription canceled, downgraded to Free',
    subscriptionId,
    userId
  });
}

async function handlePaymentFailed(data: any) {
  const { invoiceId, userId } = data;

  // In production, send email notification about failed payment
  return NextResponse.json({
    success: true,
    message: 'Payment failure recorded',
    invoiceId,
    userId
  });
}
