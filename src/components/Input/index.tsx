import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export function Input({ name, label, ...rest }: InputProps) {
  return (
    <label htmlFor={name}>
      {label}
      <input type="text" id={name} {...rest} />
    </label>
  );
}
