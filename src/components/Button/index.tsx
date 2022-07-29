import Link, { LinkProps } from 'next/link';

type ButtonProps = {
  link: string;
  name: string;
};

export default function Button({ link, name }: ButtonProps) {
  return <Link href={link}>{name}</Link>;
}
