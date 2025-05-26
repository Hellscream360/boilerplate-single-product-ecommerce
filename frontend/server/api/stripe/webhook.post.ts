import Stripe from 'stripe';
import { defineEventHandler, readRawBody } from 'h3';
import { useOrderService } from '~/services/orderService';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2025-04-30.basil',
  });
  const sig = event.headers.get('stripe-signature');
  const rawBody = await readRawBody(event);

  if (!sig || !rawBody) {
    throw createError({
      statusCode: 400,
      message: 'Missing signature or body',
    });
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      config.stripe.webhookSecret
    );

    const orderService = useOrderService();

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
      case 'payment_intent.succeeded': {
        const session = stripeEvent.data.object;
        
        if (!session.metadata?.orderId) {
          console.error('Missing orderId in session metadata:', session);
          break;
        }
        
        // Update order status in your database
        await orderService.updateOrder(Number(session.metadata.orderId), {
          status: 'completed',
          stripeSessionId: session.id,
        });
        
        break;
      }
      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const session = stripeEvent.data.object;
        
        if (!session.metadata?.orderId) {
          console.error('Missing orderId in session metadata:', session);
          break;
        }
        
        // Update order status in your database
        await orderService.updateOrder(Number(session.metadata.orderId), {
          status: 'cancelled',
          stripeSessionId: session.id,
        });
        
        break;
      }
    }

    return { received: true };
  } catch (err) {
    console.error('Error handling webhook:', err);
    throw createError({
      statusCode: 400,
      message: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
}); 