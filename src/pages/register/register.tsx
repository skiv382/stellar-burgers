import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { register } from '../../services/slices';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/use-form';

export const Register: FC = () => {
  const [values, onChange] = useForm({ userName: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      register({
        name: values.userName,
        email: values.email,
        password: values.password
      })
    )
      .unwrap()
      .then(() => navigate('/'))
      .catch(() => {});
  };

  return (
    <RegisterUI
      errorText=''
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={(value) => {
        const stringValue =
          typeof value === 'function' ? value(values.email) : value;
        const event = {
          target: { name: 'email', value: stringValue }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }}
      setPassword={(value) => {
        const stringValue =
          typeof value === 'function' ? value(values.password) : value;
        const event = {
          target: { name: 'password', value: stringValue }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }}
      setUserName={(value) => {
        const stringValue =
          typeof value === 'function' ? value(values.userName) : value;
        const event = {
          target: { name: 'userName', value: stringValue }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }}
      handleSubmit={handleSubmit}
    />
  );
};
