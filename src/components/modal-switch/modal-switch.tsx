import { FC } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Location
} from 'react-router-dom';
import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { NotFound404 } from '@pages';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { Modal } from '../modal';
import { ProtectedRoute } from '../protected-route';

export const ModalSwitch: FC = () => {
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
