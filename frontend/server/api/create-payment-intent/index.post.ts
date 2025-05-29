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

  console.log('Stripe config:', {
    hasSecretKey: !!config.stripe?.secretKey,
    apiVersion: '2025-04-30.basil'
  });

  const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2025-04-30.basil',
  });

  try {
    const body = await readBody(event);
    console.log('Received body:', body);
    const { items } = body as { items: CartItem[] };
    console.log('Cart items:', items);

    // Create line items for each product in the cart
    const lineItems = await Promise.all(items.map(async (item: CartItem) => {
      console.log('Processing item:', item);
      let stripeProduct;
      const products = await stripe.products.list({
        limit: 1,
      });
      console.log('Found existing products:', products.data.length);

      stripeProduct = products.data.find(p => p.name === item.name);
      console.log('Found matching product:', stripeProduct?.id);

      if (!stripeProduct) {
        console.log('Creating new product for:', item.name);
        stripeProduct = await stripe.products.create({
          name: item.name,
          images: item.image ? [item.image] : [],
        });
        console.log('Created new product:', stripeProduct.id);
      }

      console.log('Creating price for product:', stripeProduct.id);
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(item.price * 100), // Convert to cents
        currency: 'eur',
      });
      console.log('Created price:', stripePrice.id);

      return {
        price: stripePrice.id,
        quantity: item.quantity,
      };
    }));

    console.log('Created line items:', lineItems);

    // Create Stripe checkout session
    console.log('Creating checkout session with items:', lineItems);
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
    console.log('Created session:', session.id);

    return { id: session.id, url: session.url };
  } catch (err: any) {
    console.error('Detailed error:', {
      message: err.message,
      stack: err.stack,
      type: err.type,
      code: err.code,
      raw: err
    });
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