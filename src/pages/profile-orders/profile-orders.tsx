import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders, fetchIngredients } from '../../services/slices';
import { selectUserOrders, selectIngredients } from '../../services/selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(selectUserOrders);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
    dispatch(fetchUserOrders());
  }, [dispatch, ingredients.length]);

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
