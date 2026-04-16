import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { orderService, type CreateOrderPayload } from '../../features/orders/orderService';
import type { Order } from '../../types';

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  return await orderService.list();
});

export const createOrder = createAsyncThunk(
  'orders/create',
  async (payload: CreateOrderPayload, { rejectWithValue }) => {
    try {
      return await orderService.create(payload);
    } catch (error: any) {
      console.log("FULL ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || 
        error?.response?.data ||            
        error?.message ||                  
        'Failed to create order'
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load orders';
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to create order';
      });
  },
});

export default ordersSlice.reducer;
