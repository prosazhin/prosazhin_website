'use client';

import { MatrixBannerType } from '@/types';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Icon } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import NextLink from 'next/link';

const MatrixBanner = ({ title, description, href, className }: MatrixBannerType) => {
  return (
    <NextLink
      href={href}
      className={clsx('group bg-basic-0 no-underline! transition-colors duration-150', className)}
    >
      <div className='rounded-8 border-secondary-200 group-hover:border-primary-300 flex w-full flex-row items-center border border-solid px-24 py-16 transition'>
        <div className='flex flex-1 flex-col gap-y-2'>
          <span className='text-basic-400 text-tm20 group-hover:text-primary-400 w-full'>
            {title}
          </span>
          {description && (
            <span className='text-basic-300 text-t16 group-hover:text-basic-400 w-full'>
              {description}
            </span>
          )}
        </div>
        <Icon
          tag={ArrowRightIcon}
          size='l'
          className='text-basic-300! group-hover:text-primary-400!'
        />
      </div>
    </NextLink>
  );
};

export default MatrixBanner;
