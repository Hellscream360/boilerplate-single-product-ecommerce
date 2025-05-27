import Stripe from 'stripe';
import { defineEventHandler } from 'h3';
import { useOrderService } from '~/services/orderService';

export default defineEventHandler(async (event) => {
  // Vérifier l'authentification admin
  const token = event.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    });
  }

  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2025-04-30.basil',
  });
  
  try {
    const orderService = useOrderService();
    
    // Récupérer toutes les commandes
    const orders = await orderService.getOrders(1, 100);
    const updatedOrders = [];
    
    // Pour chaque commande, vérifier son statut dans Stripe
    for (const order of orders.data) {
      const { id, attributes: { stripeSessionId, status } } = order;
      
      if (!stripeSessionId) {
        console.warn(`Order ${id} has no Stripe session ID`);
        continue;
      }
      
      try {
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
        
        let newStatus = status;
        if (session.payment_status === 'paid') {
          newStatus = 'completed';
        } else if (session.status === 'expired' || session.payment_status === 'unpaid') {
          newStatus = 'cancelled';
        }
        
        if (newStatus !== status) {
          await orderService.updateOrder(id, { status: newStatus });
          updatedOrders.push({ id, oldStatus: status, newStatus });
        }
      } catch (err) {
        console.error(`Error syncing order ${id}:`, err);
      }
    }
    
    return {
      success: true,
      message: `Synchronized ${updatedOrders.length} orders`,
      updatedOrders
    };
  } catch (err) {
    console.error('Error syncing orders:', err);
    throw createError({
      statusCode: 500,
      message: `Error syncing orders: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
}); 