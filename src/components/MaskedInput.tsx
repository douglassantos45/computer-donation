import { InputHTMLAttributes } from 'react';
import ReactInputMask from 'react-input-mask';

type MaskedInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  onChange: (e) => void;
};

export default function MaskedInput({
  value,
  onChange,
  ...rest
}: MaskedInputProps) {
  return (
    <ReactInputMask
      mask={'99999-999'}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}
