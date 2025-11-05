import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient } from '../../services/slices';
import { selectConstructorItems } from '../../services/selectors';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const constructorItems = useSelector(selectConstructorItems);
    const selectedCount =
      ingredient.type === 'bun'
        ? constructorItems.bun?._id === ingredient._id
          ? 2
          : 0
        : count;

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={selectedCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
