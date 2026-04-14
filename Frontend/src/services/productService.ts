import { api } from './api';
import type { Product } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function normalizeProduct(product: any): Product {
  return {
    id: String(product.id),
    name: product.name,
    price: Number(product.price),
    stock: Number(product.stock ?? 0),
  };
}

export const productService = {
  list: async () => {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data.data.map(normalizeProduct);
  },
  create: async (product: Omit<Product, 'id'>) => {
    const response = await api.post<ApiResponse<Product>>('/products', product);
    return normalizeProduct(response.data.data);
  },
  update: async (id: string, product: Omit<Product, 'id'>) => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
    return normalizeProduct(response.data.data);
  },
};
