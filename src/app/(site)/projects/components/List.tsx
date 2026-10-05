'use client';

import { ProjectType } from '@/types';
import { LinkIcon } from '@heroicons/react/24/outline';
import { Badge, Tag } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import NextLink from 'next/link';
import { useMemo } from 'react';

const sizes: { [key: number]: string } = {
  2: 'md-min:col-span-3 lg-min:col-span-2 xl:col-span-2',
  3: 'desktop:col-span-3',
  4: 'md-min:col-span-3 lg-min:col-span-4 xl:col-span-4',
};

const isInternal = (url: string) => url.startsWith('/');

// Ссылка растянута на всю карточку; теги-ссылки лежат поверх неё (z-20).
const CardLink = ({ href, title }: { href: string; title: string }) =>
  isInternal(href) ? (
    <NextLink
      href={href}
      aria-label={title}
      className='absolute inset-0 z-10'
    />
  ) : (
    <a
      href={href}
      aria-label={title}
      target='_blank'
      rel='noreferrer'
      className='absolute inset-0 z-10'
    />
  );

// Документация не дублируется тегом, если на неё уже ведёт клик по карточке (href).
const ProjectTags = ({
  tags,
  resourceLinks,
  href,
}: Pick<ProjectType, 'tags' | 'resourceLinks' | 'href'>) => (
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
      .filter((link) => !(link.url.startsWith('/docs/') && link.url === href))
      .map((link) => (
        <li key={link.url}>
          <Tag
            type='button'
            size='s'
            theme='border'
            rightIcon={LinkIcon}
            href={link.url}
            target={isInternal(link.url) ? undefined : '_blank'}
            rel={isInternal(link.url) ? undefined : 'noreferrer'}
            className='relative! z-20!'
          >
            {link.title}
          </Tag>
        </li>
      ))}
  </ul>
);

// Карточка пакета внутри большой карточки (например, pbstyles и pbcomponents в дизайн-системе).
// Класс project-child нужен родителю, чтобы не подсвечиваться, пока курсор на вложенной карточке.
const ChildCard = ({ title, description, role, href, resourceLinks }: ProjectType) => (
  <li className='project-child group/child rounded-16 bg-basic-0 hover:border-primary-300 print:border-secondary-200 desktop:p-32 desktop:gap-y-32 border-secondary-200 relative z-20 flex flex-col gap-y-24 border p-24 transition-colors duration-150'>
    <div className='flex w-full flex-1 flex-col items-start gap-y-12'>
      {role && (
        <Badge
          size='s'
          color='primary'
          theme='light'
        >
          {role}
        </Badge>
      )}
      <div className='desktop:gap-y-8 flex w-full flex-col gap-y-4'>
        <h3 className='text-basic-400 group-hover/child:text-primary-400 text-tm24 desktop:text-h32 w-full transition-colors duration-150'>
          {title}
        </h3>
        <p className='text-basic-300 group-hover/child:text-basic-400 text-t16 w-full transition-colors duration-150'>
          {description}
        </p>
      </div>
    </div>
    <ProjectTags
      tags={[]}
      resourceLinks={resourceLinks}
      href={href}
    />
    <CardLink
      href={href}
      title={title}
    />
  </li>
);

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
      {firstProjects.map(({ slug, title, description, href, children, resourceLinks, tags }) => (
        <li
          key={slug}
          className='desktop:px-80 desktop:py-64 group rounded-16 bg-basic-50 hover:bg-primary-50 has-[.project-child:hover]:bg-basic-50 print:border-secondary-200 desktop:gap-y-48 relative col-span-6 flex flex-col gap-y-24 overflow-hidden px-24 pt-20 pb-24 transition-colors duration-150 print:border'
        >
          <div className='desktop:gap-y-24 flex w-full flex-1 flex-col gap-y-20'>
            <div className='desktop:gap-y-8 flex w-full flex-col gap-y-4'>
              <h2 className='text-basic-400 group-hover:text-primary-400 group-has-[.project-child:hover]:text-basic-400 text-tm24 desktop:text-h48 w-full transition-colors duration-150'>
                {title}
              </h2>
              <p className='text-basic-300 group-hover:text-basic-400 group-has-[.project-child:hover]:text-basic-300 text-t16 desktop:text-t24 w-full transition-colors duration-150'>
                {description}
              </p>
            </div>
            <ProjectTags
              tags={tags}
              resourceLinks={resourceLinks}
              href={href}
            />
          </div>
          {children && children.length > 0 && (
            <ul className='md-min:grid-cols-2 desktop:gap-24 grid w-full grid-cols-1 gap-16'>
              {children.map((child) => (
                <ChildCard
                  key={child.slug}
                  {...child}
                />
              ))}
            </ul>
          )}
          <CardLink
            href={href}
            title={title}
          />
        </li>
      ))}
      {sortedProjects.map(
        ({ slug, size, title, description, accent, href, resourceLinks, tags }) => (
          <li
            key={slug}
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
            <ProjectTags
              tags={tags}
              resourceLinks={resourceLinks}
              href={href}
            />
            <CardLink
              href={href}
              title={title}
            />
          </li>
        )
      )}
    </ul>
  );
};

export default ProjectList;
