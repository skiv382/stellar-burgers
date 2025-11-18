import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructor';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-1',
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
};

const mockMain: TIngredient = {
  _id: 'main-1',
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
};

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('constructor reducer', () => {
  const initialState = {
    items: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.items.bun).toEqual(mockBun);
      expect(state.items.ingredients).toHaveLength(0);
    });

    it('должен заменить булку, если булка уже добавлена', () => {
      const stateWithBun = {
        ...initialState,
        items: {
          bun: mockBun,
          ingredients: []
        }
      };

      const newBun: TIngredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Флюоресцентная булка R2-D3'
      };

      const action = addIngredient(newBun);
      const state = constructorReducer(stateWithBun, action);

      expect(state.items.bun).toEqual(newBun);
      expect(state.items.bun?._id).toBe('bun-2');
    });

    it('должен добавить начинку в конструктор', () => {
      const action = addIngredient(mockMain);
      const state = constructorReducer(initialState, action);

      expect(state.items.bun).toBeNull();
      expect(state.items.ingredients).toHaveLength(1);
      expect(state.items.ingredients[0]._id).toBe(mockMain._id);
      expect(state.items.ingredients[0].name).toBe(mockMain.name);
      expect(state.items.ingredients[0]).toHaveProperty('id');
    });

    it('должен добавить соус в конструктор', () => {
      const action = addIngredient(mockSauce);
      const state = constructorReducer(initialState, action);

      expect(state.items.bun).toBeNull();
      expect(state.items.ingredients).toHaveLength(1);
      expect(state.items.ingredients[0]._id).toBe(mockSauce._id);
      expect(state.items.ingredients[0].name).toBe(mockSauce.name);
    });

    it('должен добавить несколько начинок в конструктор', () => {
      const action1 = addIngredient(mockMain);
      const state1 = constructorReducer(initialState, action1);

      const action2 = addIngredient(mockSauce);
      const state2 = constructorReducer(state1, action2);

      expect(state2.items.ingredients).toHaveLength(2);
      expect(state2.items.ingredients[0]._id).toBe(mockMain._id);
      expect(state2.items.ingredients[1]._id).toBe(mockSauce._id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент из конструктора', () => {
      const stateWithIngredients = {
        ...initialState,
        items: {
          bun: null,
          ingredients: [
            { ...mockMain, id: 'id-1' },
            { ...mockSauce, id: 'id-2' }
          ]
        }
      };

      const action = removeIngredient('id-1');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.items.ingredients).toHaveLength(1);
      expect(state.items.ingredients[0].id).toBe('id-2');
    });

    it('должен удалить правильный ингредиент при наличии нескольких', () => {
      const stateWithIngredients = {
        ...initialState,
        items: {
          bun: null,
          ingredients: [
            { ...mockMain, id: 'id-1' },
            { ...mockSauce, id: 'id-2' },
            { ...mockMain, id: 'id-3' }
          ]
        }
      };

      const action = removeIngredient('id-2');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.items.ingredients).toHaveLength(2);
      expect(state.items.ingredients[0].id).toBe('id-1');
      expect(state.items.ingredients[1].id).toBe('id-3');
    });

    it('не должен изменять состояние при удалении из пустого конструктора', () => {
      const state = constructorReducer(initialState, removeIngredient('id-1'));

      expect(state.items.bun).toBeNull();
      expect(state.items.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент с одной позиции на другую', () => {
      const stateWithIngredients = {
        ...initialState,
        items: {
          bun: null,
          ingredients: [
            { ...mockMain, id: 'id-1' },
            { ...mockSauce, id: 'id-2' },
            { ...mockMain, id: 'id-3' }
          ]
        }
      };

      const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.items.ingredients).toHaveLength(3);
      expect(state.items.ingredients[0].id).toBe('id-2');
      expect(state.items.ingredients[1].id).toBe('id-3');
      expect(state.items.ingredients[2].id).toBe('id-1');
    });

    it('должен переместить ингредиент в начало списка', () => {
      const stateWithIngredients = {
        ...initialState,
        items: {
          bun: null,
          ingredients: [
            { ...mockMain, id: 'id-1' },
            { ...mockSauce, id: 'id-2' }
          ]
        }
      };

      const action = moveIngredient({ fromIndex: 1, toIndex: 0 });
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.items.ingredients[0].id).toBe('id-2');
      expect(state.items.ingredients[1].id).toBe('id-1');
    });

    it('не должен изменять порядок при некорректных индексах', () => {
      const stateWithIngredients = {
        ...initialState,
        items: {
          bun: null,
          ingredients: [
            { ...mockMain, id: 'id-1' },
            { ...mockSauce, id: 'id-2' }
          ]
        }
      };

      const state = constructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 5, toIndex: -1 })
      );

      expect(state.items.ingredients[0].id).toBe('id-1');
      expect(state.items.ingredients[1].id).toBe('id-2');
    });
  });
});
