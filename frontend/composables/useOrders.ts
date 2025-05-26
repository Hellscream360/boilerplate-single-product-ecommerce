import { ref } from 'vue';

interface Order {
  id: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  stripeSessionId: string;
}

interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  stripeSessionId: string;
}

export const useOrders = () => {
  const orders = ref<Order[]>([]);
  const currentOrder = ref<Order | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();

      const response = await fetch(
        `${config.public.strapiUrl}/api/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: orderData,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Permission denied. Please contact support if this persists.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to create order');
      }

      const data = await response.json();
      const newOrder = {
        id: data.data.id,
        ...data.data.attributes,
      };
      
      orders.value = [newOrder, ...orders.value];
      currentOrder.value = newOrder;
      
      return newOrder;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrders = async (page = 1, pageSize = 10) => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${config.public.strapiUrl}/api/orders?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      orders.value = data.data.map((order: any) => ({
        id: order.id,
        ...order.attributes,
      }));

      return {
        orders: orders.value,
        pagination: data.meta.pagination,
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
      return {
        orders: [],
        pagination: {
          page: 1,
          pageSize,
          pageCount: 0,
          total: 0,
        },
      };
    } finally {
      loading.value = false;
    }
  };

  const fetchOrder = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${config.public.strapiUrl}/api/orders/${id}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      currentOrder.value = {
        id: data.data.id,
        ...data.data.attributes,
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      loading.value = false;
    }
  };

  const updateOrder = async (id: number, updates: Partial<Order>): Promise<Order> => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();

      const response = await fetch(
        `${config.public.strapiUrl}/api/orders/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: updates,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const data = await response.json();
      const updatedOrder = {
        id: data.data.id,
        ...data.data.attributes,
      };
      
      currentOrder.value = updatedOrder;
      orders.value = orders.value.map(order => 
        order.id === id ? updatedOrder : order
      );
      
      return updatedOrder;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    updateOrder,
    createOrder,
  };
}; 