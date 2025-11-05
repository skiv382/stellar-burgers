import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, fetchIngredients } from '../../services/slices';
import { selectFeed, selectIngredients } from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(selectFeed);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
    dispatch(fetchFeeds());
  }, [dispatch, ingredients.length]);

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
