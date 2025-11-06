import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  clearCurrentOrder,
  fetchIngredients
} from '../../services/slices';
import { selectCurrentOrder } from '../../services/selectors';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/selectors';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector(selectCurrentOrder);
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
    if (number) {
      dispatch(clearCurrentOrder());
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, ingredients.length]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, ingredients]);

  if (loading || ingredientsLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
