import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';

type ActiveLinkProps = LinkProps & {
  children: ReactElement;
  activeClassName: string;
};

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();
  const className = asPath === rest.href ? activeClassName : '';

  //CloneElement ele pega os filhos da tag para modificar os comportamentos
  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}
