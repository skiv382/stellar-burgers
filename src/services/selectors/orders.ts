import { RootState } from '../store';

export const selectFeed = (state: RootState) => state.orders.feed;
export const selectUserOrders = (state: RootState) => state.orders.user;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
