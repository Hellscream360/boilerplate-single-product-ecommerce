import type { Order, OrderResponse, OrdersResponse } from '~/types/order';

export const useOrderService = () => {
  const config = useRuntimeConfig();
  const strapiUrl = config.public.strapiUrl;

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderResponse> => {
    try {
      const response = await fetch(`${strapiUrl}/api/orders`, {
        method: 'POST',
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
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const getOrder = async (orderId: number): Promise<OrderResponse> => {
    try {
      const response = await fetch(`${strapiUrl}/api/orders/${orderId}?populate=*`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  };

  const getOrders = async (page = 1, pageSize = 10): Promise<OrdersResponse> => {
    try {
      const response = await fetch(
        `${strapiUrl}/api/orders?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  const updateOrder = async (orderId: number, orderData: Partial<Order>): Promise<OrderResponse> => {
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
    createOrder,
    getOrder,
    getOrders,
    updateOrder
  };
}; 