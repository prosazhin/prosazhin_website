'use client';

import { CompilationType, TagType } from '@/types';
import { Badge, Dialog, useShowDialog } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Link from './Link';

const Compilation = (props: CompilationType) => {
  const { id, title, description, tags, activeTag, links, className } = props;
  const { t } = useTranslation();

  const DialogChildren = () => (
    <div className='flex w-full flex-col'>
      <h3 className='text-h32 text-basic-400'>{title}</h3>
      <p className='text-basic-300 text-t20 mt-8'>{description}</p>
      {links?.length && (
        <div className='max-xs:grid-cols-1 mt-24 grid grid-cols-2 gap-24'>
          {links.map((item) => (
            <Link
              {...item}
              key={item.url}
              activeTag={activeTag}
            />
          ))}
        </div>
      )}
    </div>
  );

  const showDialog = useShowDialog(
    () => (
      <Dialog id={`compilation-content-${id}`}>
        <DialogChildren />
      </Dialog>
    ),
    [id, title, description, tags, activeTag, links]
  );

  return (
    <div
      className={clsx(
        'desktop:min-h-200 group rounded-8 border-secondary-200 hover:border-primary-300 flex h-auto cursor-pointer flex-col justify-self-stretch border px-24 py-16 transition-colors duration-150',
        className
      )}
      onClick={showDialog}
    >
      <span className='text-tm24 text-basic-400 group-hover:text-primary-400 w-full transition-colors duration-150'>
        {title}
      </span>
      <span className='text-t16 text-basic-300 group-hover:text-basic-400 mt-6 w-full flex-1 transition-colors duration-150'>
        {description}
      </span>
      <ul className='mt-16 flex w-full flex-row flex-wrap items-end justify-start gap-4'>
        <Badge
          size='s'
          color='primary'
          theme='filled'
        >
          {t('compilation')}
        </Badge>
        {links && (
          <Badge
            size='s'
            color='secondary'
            theme='light'
          >
            {t('plurals.links.links', { count: links?.length })}
          </Badge>
        )}
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
    </div>
  );
};

export default Compilation;
