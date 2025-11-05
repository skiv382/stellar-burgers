import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors';
import { fetchIngredients } from '../../services/slices';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!ingredients.length) dispatch(fetchIngredients());
  }, [dispatch, ingredients.length]);

  const ingredientData = useMemo(
    () => ingredients.find((ing: TIngredient) => ing._id === id) || null,
    [ingredients, id]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
