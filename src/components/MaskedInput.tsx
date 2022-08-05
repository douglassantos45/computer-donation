import { ChangeEvent, InputHTMLAttributes } from 'react';
import ReactInputMask from 'react-input-mask';

interface MaskedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

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
