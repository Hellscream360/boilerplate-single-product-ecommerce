export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id?: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  stripeSessionId: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderResponse {
  data: {
    id: number;
    attributes: Order;
  };
}

export interface OrdersResponse {
  data: Array<{
    id: number;
    attributes: Order;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
} 