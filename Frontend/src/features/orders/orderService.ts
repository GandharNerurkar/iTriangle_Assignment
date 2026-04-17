import { api } from '@shared/lib/api';
import type { Order, OrderItem } from '@shared/types';

export interface CreateOrderPayload {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function normalizeOrderItem(item: any): OrderItem {
  return {
    productId: String(item.product_id),
    name: item.product_name ?? '',
    quantity: Number(item.quantity),
    price: Number(item.price),
    subtotal: Number(item.price) * Number(item.quantity),
  };
}

function normalizeOrder(order: any): Order {
  return {
    id: String(order.id),
    customerId: String(order.customer_id),
    customerName: order.customer_name ?? order.customerName ?? '',
    items: Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : [],
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    total: Number(order.total),
    stock: Number(order.stock ?? 0),
    createdAt: order.created_at ?? order.createdAt ?? '',
  };
}
export const orderService = {
  list: async () => {
    const response = await api.get<ApiResponse<any[]>>('/orders');
    return response.data.data.map(normalizeOrder);
  },
  detail: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/orders/${id}`);
    return normalizeOrder(response.data.data);
  },
  create: async (payload: CreateOrderPayload) => {
    const backendPayload = {
      customer_id: Number(payload.customerId),
      items: payload.items.map((item) => ({
        product_id: Number(item.productId),
        quantity: Number(item.quantity),
      })),
    };
    const response = await api.post<ApiResponse<any>>('/orders', backendPayload);
    return normalizeOrder(response.data.data);
  },
};
