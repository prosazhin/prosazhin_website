'use client';

import { useDialog } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const Nav = ({
  nav,
  className,
}: {
  nav: Record<string, { url: string; active: string[] }>;
  className?: string;
}) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { closeDialog } = useDialog();
  const items = t('nav', { returnObjects: true }) as Array<{ type: string; title: string }>;

  return (
    <nav className={clsx('desktop:flex-row flex flex-col gap-24', className)}>
      {items.map((item) => {
        const { url, active } = nav[item.type as keyof typeof nav];
        return (
          <li key={item.type}>
            <NextLink
              href={url}
              className={clsx(
                'text-tm16 text-basic-400 group-hover:text-basic-300 hover:text-primary-400! no-underline! transition-colors duration-150',
                active.includes(pathname) ? 'text-primary-400!' : ''
              )}
              onClick={() => closeDialog('mobile-menu')}
            >
              {item.title}
            </NextLink>
          </li>
        );
      })}
    </nav>
  );
};

export default Nav;
