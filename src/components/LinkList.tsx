'use client';

import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { Tag } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import NextLink from 'next/link';

// Теги-ссылки: иконка зависит от того, ведёт ли ссылка внутрь сайта или наружу. Компонент
// клиентский, потому что иконку и linkComponent нельзя передать пропом из Server Component.
const isInternal = (url: string) => url.startsWith('/');

const LinkList = ({
  items,
  size = 's',
  className,
  itemClassName,
}: {
  items: Array<{ title: string; url: string }>;
  size?: 's' | 'm';
  className?: string;
  itemClassName?: string;
}) => (
  <ul className={clsx('flex flex-row flex-wrap gap-8', className)}>
    {items.map(({ title, url }) => (
      <li
        key={url}
        className={itemClassName}
      >
        <Tag
          size={size}
          theme='border'
          rightIcon={isInternal(url) ? ArrowRightIcon : ArrowUpRightIcon}
          {...(isInternal(url)
            ? { href: url, linkComponent: NextLink }
            : { href: url, target: '_blank', rel: 'noreferrer' })}
        >
          {title}
        </Tag>
      </li>
    ))}
  </ul>
);

export default LinkList;
