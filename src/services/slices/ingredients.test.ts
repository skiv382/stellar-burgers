import { ingredientsReducer, fetchIngredients } from './ingredients';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredients reducer', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  describe('fetchIngredients.pending', () => {
    it('должен установить loading в true при начале загрузки', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.items).toEqual([]);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен установить loading в false и сохранить ингредиенты при успешной загрузке', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
    });

    it('должен заменить существующие ингредиенты новыми', () => {
      const stateWithIngredients = {
        items: mockIngredients,
        loading: false,
        error: null
      };

      const newIngredients: TIngredient[] = [
        {
          _id: 'new-1',
          name: 'Новый ингредиент',
          type: 'sauce',
          proteins: 10,
          fat: 5,
          carbohydrates: 15,
          calories: 100,
          price: 50,
          image: 'image.png',
          image_mobile: 'image-mobile.png',
          image_large: 'image-large.png'
        }
      ];

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: newIngredients
      };
      const state = ingredientsReducer(stateWithIngredients, action);

      expect(state.items).toEqual(newIngredients);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]._id).toBe('new-1');
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен установить loading в false и сохранить ошибку при неудачной загрузке', () => {
      const errorMessage = 'Failed to load ingredients';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    it('должен установить дефолтное сообщение об ошибке, если сообщение отсутствует', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to load ingredients');
    });

    it('должен очистить ошибку при следующем запросе', () => {
      const stateWithError = {
        items: [],
        loading: false,
        error: 'Previous error'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });
});

