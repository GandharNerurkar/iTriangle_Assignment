import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { customerService } from '@features/customers/customerService';
import type { Customer } from '@shared/types';

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk('customers/fetch', async () => {
  return await customerService.list();
});

export const createCustomer = createAsyncThunk('customers/create', async (payload: Omit<Customer, 'id'>) => {
  return await customerService.create(payload);
});

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }: { id: string; data: Omit<Customer, 'id'> }) => {
    return await customerService.update(id, data);
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load customers';
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to create customer';
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.items = state.items.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer
        );
        state.loading = false;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to update customer';
      });
  },
});

export default customersSlice.reducer;
