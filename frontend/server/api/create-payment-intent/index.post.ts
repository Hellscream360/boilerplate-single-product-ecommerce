import Stripe from 'stripe';
import { defineEventHandler, readBody } from 'h3';

interface CartItem {
  price: number;
  quantity: number;
  name: string;
  image?: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  if (!config.stripe?.secretKey) {
    throw createError({
      statusCode: 500,
      message: 'Stripe secret key is not configured',
    });
  }

  const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2025-04-30.basil',
  });

  try {
    const body = await readBody(event);
    const { items } = body as { items: CartItem[] };

    // Create line items for each product in the cart
    const lineItems = await Promise.all(items.map(async (item: CartItem) => {
      let stripeProduct;
      const products = await stripe.products.list({
        limit: 1,
      });

      stripeProduct = products.data.find(p => p.name === item.name);

      if (!stripeProduct) {
        stripeProduct = await stripe.products.create({
          name: item.name,
          images: item.image ? [item.image] : [],
        });
      }

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(item.price * 100), // Convert to cents
        currency: 'eur',
      });

      return {
        price: stripePrice.id,
        quantity: item.quantity,
      };
    }));


    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'US', 'GB'],
      },
      customer_creation: 'always',
      phone_number_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      line_items: lineItems,
      success_url: `${config.public.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.siteUrl}/checkout/cancel`,
    });

    return { id: session.id, url: session.url };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: `Error creating checkout session: ${err.message}`,
      data: {
        error: err.message,
        type: err.type,
        code: err.code
      }
    });
  }
}); 