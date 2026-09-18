'use client';

import { LinkType, TagType } from '@/types';
import { Badge } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import NextLink from 'next/link';

const Link = (props: LinkType) => {
  const { url = '', title, description, tags, activeTag, className } = props;

  return (
    <NextLink
      href={url}
      target='_blank'
      className={clsx(
        'group desktop:min-h-200 rounded-8 border-secondary-200 hover:border-primary-300 flex h-auto flex-col justify-self-stretch border px-16 py-12 no-underline! transition-colors duration-150',
        className
      )}
    >
      <span className='text-tm20 text-basic-400 group-hover:text-primary-400 w-full no-underline! transition-colors duration-150'>
        {title}
      </span>
      <span className='text-t14 text-basic-300 group-hover:text-basic-400 mt-6 w-full flex-1 no-underline! transition-colors duration-150'>
        {description}
      </span>
      {tags.length > 0 && (
        <ul className='mt-16 flex w-full flex-row flex-wrap items-end justify-start gap-4'>
          {tags.map((tag: TagType) => (
            <li key={tag.url}>
              <Badge
                size='s'
                color={activeTag === tag.url ? 'primary' : 'secondary'}
                theme='light'
              >
                {tag.title}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </NextLink>
  );
};

export default Link;
