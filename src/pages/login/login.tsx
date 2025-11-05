import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { login } from '../../services/slices';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/use-form';

export const Login: FC = () => {
  const [values, onChange] = useForm({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(login({ email: values.email, password: values.password }))
      .unwrap()
      .then(() => {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      setEmail={(value) => {
        const stringValue =
          typeof value === 'function' ? value(values.email) : value;
        const event = {
          target: { name: 'email', value: stringValue }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }}
      password={values.password}
      setPassword={(value) => {
        const stringValue =
          typeof value === 'function' ? value(values.password) : value;
        const event = {
          target: { name: 'password', value: stringValue }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }}
      handleSubmit={handleSubmit}
    />
  );
};
