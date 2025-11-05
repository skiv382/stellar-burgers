import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/selectors';
import { selectUser } from '../../services/selectors';
import {
  closeOrderModal as closeOrderModalAction,
  placeOrder,
  fetchUserOrders,
  fetchFeeds
} from '../../services/slices';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems) || {
    bun: null,
    ingredients: []
  };
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const onOrderClick = () => {
    if (!constructorItems?.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/' } });
      return;
    }
    dispatch(placeOrder())
      .unwrap()
      .then(() => {
        dispatch(fetchUserOrders());
        dispatch(fetchFeeds());
      })
      .catch(() => {});
  };
  const closeOrderModal = () => {
    dispatch(closeOrderModalAction());
  };

  const price = useMemo(
    () =>
      (constructorItems?.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems?.ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
