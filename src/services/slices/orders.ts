import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export type OrdersState = {
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
    loading: boolean;
    error: string | null;
  };
  user: {
    orders: TOrder[];
    loading: boolean;
    error: string | null;
  };
  currentOrder: {
    order: TOrder | null;
    loading: boolean;
    error: string | null;
  };
};

const initialState: OrdersState = {
  feed: { orders: [], total: 0, totalToday: 0, loading: false, error: null },
  user: { orders: [], loading: false, error: null },
  currentOrder: { order: null, loading: false, error: null }
};

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', getFeedsApi);

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchUserOrders',
  async () => {
    const res = await getOrdersApi();
    return res;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder.order = null;
      state.currentOrder.loading = false;
      state.currentOrder.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.feed.loading = true;
        state.feed.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.feed.loading = false;
        state.feed.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.feed.loading = false;
        state.feed.error = action.error.message || 'Failed to load feed';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.user.loading = true;
        state.user.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.user.loading = false;
          state.user.orders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.user.loading = false;
        state.user.error = action.error.message || 'Failed to load orders';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrder.loading = true;
        state.currentOrder.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.currentOrder.loading = false;
          state.currentOrder.order = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrder.loading = false;
        state.currentOrder.error =
          action.error.message || 'Failed to load order';
      });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
