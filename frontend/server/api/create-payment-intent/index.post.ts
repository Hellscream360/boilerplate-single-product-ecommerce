import Stripe from 'stripe';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2025-04-30.basil',
  });

  try {
    const body = await readBody(event);
    const { price, quantity, productName, productImage, customerEmail, metadata } = body;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              images: productImage ? [productImage] : [],
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: quantity,
        },
      ],
      success_url: `${config.public.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.siteUrl}/checkout/cancel`,
      metadata: metadata,
    });

    return { id: session.id, url: session.url };
  } catch (err) {
    console.error('Error creating checkout session:', err);
    throw createError({
      statusCode: 500,
      message: 'Error creating checkout session',
    });
  }
}); 