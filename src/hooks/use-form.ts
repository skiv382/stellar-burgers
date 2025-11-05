import { useState, ChangeEvent } from 'react';

export function useForm<T extends { [key: string]: string }>(baseForm: T) {
  const [form, setForm] = useState<T>(baseForm);

  function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
    setForm((pastForm) => ({ ...pastForm, [target.name]: target.value }));
  }

  return [form, handleChange] as const;
}
