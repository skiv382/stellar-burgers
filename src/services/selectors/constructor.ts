import { RootState } from '../store';

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor?.items || { bun: null, ingredients: [] };
export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor?.orderRequest || false;
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor?.orderModalData || null;
