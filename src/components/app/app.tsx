import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { NotFound404 } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { IngredientDetails } from '@components';
import { OrderInfo } from '@components';
import { Modal } from '@components';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Location
} from 'react-router-dom';
import { FC, useEffect } from 'react';
import { ProtectedRoute } from '../protected-route';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser, setAuthChecked } from '../../services/slices';
import { selectIsAuthChecked } from '../../services/selectors';
import { getCookie } from '../../utils/cookie';

const AuthInit: FC = () => {
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

const ModalSwitch: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location } | undefined;
  const background = state && state.background;

  const onClose = () => navigate(-1);

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password/:token?'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <>
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal onClose={onClose} title='Детали ингредиента'>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/feed/:number'
              element={
                <Modal onClose={onClose} title=''>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal onClose={onClose} title=''>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        </>
      )}
    </>
  );
};

const App: FC = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <AppHeader />
      <AuthInit />
      <ModalSwitch />
    </div>
  </BrowserRouter>
);

export default App;
