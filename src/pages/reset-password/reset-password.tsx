import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const { token: tokenFromUrl } = useParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(tokenFromUrl || '');
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      const cleanToken = tokenFromUrl.trim().replace(/\.+$/, '');
      setToken(cleanToken);
    }
  }, [tokenFromUrl]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError(new Error('Пароль обязателен'));
      return;
    }

    if (!token) {
      setError(new Error('Токен обязателен для восстановления пароля'));
      return;
    }

    setLoading(true);
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        const errorMessage =
          typeof err === 'string'
            ? err
            : err?.message ||
              err?.error ||
              'Произошла ошибка при восстановлении пароля';
        setError(new Error(errorMessage));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword') && !tokenFromUrl) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate, tokenFromUrl]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};
