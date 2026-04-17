import { api } from '@shared/lib/api';
import type { Customer } from '@shared/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const customerService = {
  list: async () => {
    const response = await api.get<ApiResponse<Customer[]>>('/customers');
    return response.data.data;
  },
  create: async (customer: Omit<Customer, 'id'>) => {
    const response = await api.post<ApiResponse<Customer>>('/customers', customer);
    return response.data.data;
  },
  update: async (id: string, customer: Omit<Customer, 'id'>) => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, customer);
    return response.data.data;
  },
};
