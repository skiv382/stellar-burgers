import { rootReducer } from './store';
import { UNKNOWN_ACTION } from './slices/constants';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при вызове с undefined состоянием', () => {
    const state = rootReducer(undefined, { type: UNKNOWN_ACTION });

    expect(state).toEqual({
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      auth: {
        user: null,
        loading: false,
        error: null,
        isAuthChecked: false
      },
      orders: {
        feed: {
          orders: [],
          total: 0,
          totalToday: 0,
          loading: false,
          error: null
        },
        user: {
          orders: [],
          loading: false,
          error: null
        },
        currentOrder: {
          order: null,
          loading: false,
          error: null
        }
      },
      burgerConstructor: {
        items: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null,
        error: null
      }
    });
  });

  it('должен возвращать текущее состояние при обработке неизвестного экшена', () => {
    const initialState = {
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      auth: {
        user: null,
        loading: false,
        error: null,
        isAuthChecked: false
      },
      orders: {
        feed: {
          orders: [],
          total: 0,
          totalToday: 0,
          loading: false,
          error: null
        },
        user: {
          orders: [],
          loading: false,
          error: null
        },
        currentOrder: {
          order: null,
          loading: false,
          error: null
        }
      },
      burgerConstructor: {
        items: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null,
        error: null
      }
    };

    const state = rootReducer(initialState, { type: UNKNOWN_ACTION });

    expect(state).toEqual(initialState);
  });
});
