'use client';

import { ProjectType } from '@/types';
import { LinkIcon } from '@heroicons/react/24/outline';
import { Badge, Tag } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import { useMemo } from 'react';

const sizes: { [key: number]: string } = {
  2: 'md-min:col-span-3 lg-min:col-span-2 xl:col-span-2',
  3: 'desktop:col-span-3',
  4: 'md-min:col-span-3 lg-min:col-span-4 xl:col-span-4',
};

const ProjectList = ({ projects }: { projects: ProjectType[] }) => {
  const firstProjects = useMemo(() => {
    const result = [...projects.filter(({ first }) => first)];
    return result.sort((a, b) => a.order - b.order);
  }, [projects]);

  const sortedProjects = useMemo(() => {
    const result = [...projects.filter(({ first }) => !first)];
    return result.sort((a, b) => a.order - b.order);
  }, [projects]);

  return (
    <ul className='grid w-full grid-flow-dense grid-cols-6 gap-24'>
      {firstProjects.map(({ title, description, resourceLinks, tags }, index) => (
        <li
          key={index}
          className='desktop:px-80 desktop:py-64 group rounded-16 bg-basic-50 hover:bg-primary-50 print:border-secondary-200 relative col-span-6 flex flex-col gap-y-24 overflow-hidden px-24 pt-20 pb-24 transition-colors duration-150 print:border'
        >
          <div className='desktop:gap-y-8 flex w-full flex-1 flex-col gap-y-4'>
            <h2 className='text-basic-400 group-hover:text-primary-400 text-tm24 desktop:text-h48 w-full transition-colors duration-150'>
              {title}
            </h2>
            <p className='text-t3 text-basic-300 group-hover:text-basic-400 text-t16 desktop:text-t24 w-full transition-colors duration-150'>
              {description}
            </p>
          </div>
          <ul className='flex w-full flex-row flex-wrap gap-4'>
            {tags.map((tag) => (
              <li key={tag.url}>
                <Badge
                  size='s'
                  color='secondary'
                  theme='border'
                >
                  {tag.title}
                </Badge>
              </li>
            ))}
            {resourceLinks
              .filter((link) => !link.url.startsWith('/docs/'))
              .map((link) => (
                <li key={link.url}>
                  <Tag
                    type='button'
                    size='s'
                    theme='border'
                    rightIcon={LinkIcon}
                    href={link.url}
                    target={link.url.startsWith('/') ? undefined : '_blank'}
                    rel={link.url.startsWith('/') ? undefined : 'noreferrer'}
                    className='relative! z-20!'
                  >
                    {link.title}
                  </Tag>
                </li>
              ))}
          </ul>
          <a
            className='absolute inset-0 z-10 m-auto h-full w-full'
            href={resourceLinks[0].url}
            target={resourceLinks[0].url.startsWith('/') ? undefined : '_blank'}
            rel={resourceLinks[0].url.startsWith('/') ? undefined : 'noreferrer'}
          />
        </li>
      ))}
      {sortedProjects.map(({ size, title, description, accent, resourceLinks, tags }, index) => (
        <li
          key={index}
          className={clsx(
            'group rounded-16 relative col-span-6 flex flex-col gap-y-24 overflow-hidden transition-colors duration-150',
            sizes[size],
            accent
              ? 'desktop:px-40 desktop:pt-32 desktop:pb-40 bg-basic-50 hover:bg-primary-50 print:border-secondary-200 px-24 pt-20 pb-24 print:border'
              : 'border-secondary-200 hover:border-primary-300 border px-24 pt-20 pb-24'
          )}
        >
          <div
            className={clsx(
              'flex w-full flex-1 flex-col',
              accent ? 'desktop:gap-y-8 gap-y-4' : 'gap-y-4'
            )}
          >
            <h2
              className={clsx(
                'text-basic-400 group-hover:text-primary-400 w-full transition-colors duration-150',
                accent ? 'text-tm24 desktop:text-h32' : 'text-tm24'
              )}
            >
              {title}
            </h2>
            <p
              className={clsx(
                'text-t3 text-basic-300 group-hover:text-basic-400 w-full transition-colors duration-150',
                accent ? 'text-t16 desktop:text-t20' : 'text-t16'
              )}
            >
              {description}
            </p>
          </div>
          <ul className='flex w-full flex-row flex-wrap gap-4'>
            {tags.map((tag) => (
              <li key={tag.url}>
                <Badge
                  size='s'
                  color='secondary'
                  theme='border'
                >
                  {tag.title}
                </Badge>
              </li>
            ))}
            {resourceLinks
              .filter((link) => !link.url.startsWith('/docs/'))
              .map((link) => (
                <li key={link.url}>
                  <Tag
                    type='button'
                    size='s'
                    theme='border'
                    rightIcon={LinkIcon}
                    href={link.url}
                    target={link.url.startsWith('/') ? undefined : '_blank'}
                    rel={link.url.startsWith('/') ? undefined : 'noreferrer'}
                    className='relative! z-20!'
                  >
                    {link.title}
                  </Tag>
                </li>
              ))}
          </ul>
          <a
            className='absolute inset-0 z-10 m-auto h-full w-full'
            href={resourceLinks[0].url}
            target={resourceLinks[0].url.startsWith('/') ? undefined : '_blank'}
            rel={resourceLinks[0].url.startsWith('/') ? undefined : 'noreferrer'}
          />
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
