import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices';
import { selectFeed } from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(selectFeed);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
