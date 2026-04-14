import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import type { Product } from '../../types';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  return await productService.list();
});

export const createProduct = createAsyncThunk('products/create', async (payload: Omit<Product, 'id'>) => {
  return await productService.create(payload);
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: string; data: Omit<Product, 'id'> }) => {
    return await productService.update(id, data);
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load products';
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to create product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items = state.items.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to update product';
      });
  },
});

export default productsSlice.reducer;
