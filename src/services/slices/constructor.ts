import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';

export type ConstructorItemsState = {
  bun: TIngredient | null;
  ingredients: (TIngredient & { id: string })[];
};

export type ConstructorState = {
  items: ConstructorItemsState;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: ConstructorState = {
  items: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const placeOrder = createAsyncThunk<TOrder, void, { state: RootState }>(
  'constructor/placeOrder',
  async (_arg: void, thunkApi: { getState: () => RootState }) => {
    const state = thunkApi.getState();
    const items: ConstructorItemsState = state.burgerConstructor.items;
    if (!items.bun) throw new Error('Bun is required');
    const ingredientsIds = [
      items.bun._id,
      ...items.ingredients.map((i) => i._id),
      items.bun._id
    ];
    const res = await orderBurgerApi(ingredientsIds);
    return res.order;
  }
);

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, uniqueId: uuidv4() }
      }),
      reducer(
        state: ConstructorState,
        action: PayloadAction<TIngredient & { uniqueId: string }>
      ) {
        const { uniqueId, ...ingredient } = action.payload;
        if (ingredient.type === 'bun') {
          state.items.bun = ingredient;
        } else {
          state.items.ingredients.push({ ...ingredient, id: uniqueId });
        }
      }
    },
    removeIngredient(state: ConstructorState, action: PayloadAction<string>) {
      state.items.ingredients = state.items.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },
    moveIngredient(
      state: ConstructorState,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const arr = state.items.ingredients;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
    },
    clearConstructor(state: ConstructorState) {
      state.items = { bun: null, ingredients: [] };
    },
    closeOrderModal(state: ConstructorState) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state: ConstructorState) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        placeOrder.fulfilled,
        (state: ConstructorState, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
          state.items = { bun: null, ingredients: [] };
        }
      )
      .addCase(placeOrder.rejected, (state: ConstructorState, action: any) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Order failed';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
