import { NextRequest, NextResponse } from 'next/server';

// Get subscription details
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In production, fetch from database
    // const subscription = await db.subscriptions.findByUserId(userId);

    // Demo subscription data
    const subscription = {
      id: `sub_demo_${userId}`,
      userId,
      plan: 'Catalyst',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      trialEnd: null,
      paymentMethod: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025
      },
      invoices: [
        {
          id: 'inv_001',
          amount: 1999,
          status: 'paid',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'inv_002',
          amount: 1999,
          status: 'paid',
          date: new Date().toISOString()
        }
      ],
      usage: {
        aiQueries: { used: 35, limit: 50 },
        dataUploads: { used: 8, limit: 10 }
      }
    };

    return NextResponse.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

// Update subscription (upgrade/downgrade)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, newPriceId } = body;

    if (!subscriptionId || !newPriceId) {
      return NextResponse.json(
        { error: 'Subscription ID and new price ID are required' },
        { status: 400 }
      );
    }

    // In production with Stripe:
    // const subscription = await stripe.subscriptions.update(subscriptionId, {
    //   items: [{ id: subscription.items.data[0].id, price: newPriceId }],
    //   proration_behavior: 'create_prorations'
    // });

    const planNames: Record<string, string> = {
      'price_catalyst': 'Catalyst',
      'price_strategist': 'Strategist',
      'price_visionary': 'Visionary'
    };

    return NextResponse.json({
      success: true,
      message: `Subscription updated to ${planNames[newPriceId] || newPriceId}`,
      subscriptionId,
      newPlan: planNames[newPriceId]
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, cancelImmediately = false } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // In production with Stripe:
    // if (cancelImmediately) {
    //   await stripe.subscriptions.del(subscriptionId);
    // } else {
    //   await stripe.subscriptions.update(subscriptionId, {
    //     cancel_at_period_end: true
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: cancelImmediately
        ? 'Subscription canceled immediately'
        : 'Subscription will cancel at end of billing period',
      subscriptionId,
      cancelAtPeriodEnd: !cancelImmediately
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
