interface Order {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  stripeSessionId: string;
}

export const useOrderService = () => {
  const config = useRuntimeConfig();
  const strapiUrl = config.public.strapiUrl;

  const updateOrder = async (orderId: number, orderData: Partial<Order>): Promise<Order> => {
    try {
      const response = await fetch(`${strapiUrl}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: orderData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  return {
    updateOrder
  };
}; 