import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser, setAuthChecked } from '../../services/slices';
import { selectIsAuthChecked } from '../../services/selectors';
import { getCookie } from '../../utils/cookie';

export const AuthInit: FC = () => {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    const token = getCookie('accessToken');
    if (!isAuthChecked) {
      if (token) {
        dispatch(fetchUser());
      } else {
        dispatch(setAuthChecked(true));
      }
    }
  }, [dispatch, isAuthChecked]);

  return null;
};
