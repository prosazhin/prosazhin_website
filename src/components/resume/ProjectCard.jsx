'use client';

import { LinkIcon } from '@heroicons/react/24/outline';
import { Tag } from '@prosazhin/pbcomponents';

// Клиентский компонент: rightIcon={LinkIcon} — ссылка на функцию, её нельзя передать
// пропом из серверного компонента (resume/index.jsx) в клиентский Tag напрямую.
// Стиль карточки такой же, как у некрупных карточек на /projects (List.tsx),
// но без градации по размеру — здесь все карточки однотипные.
const ProjectCard = ({ title, description, resourceLinks }) => (
  <div className='group border-secondary-200 hover:border-primary-300 rounded-16 relative flex w-full flex-col gap-y-16 border px-24 pt-20 pb-24 transition-colors duration-150'>
    <div className='flex w-full flex-1 flex-col gap-y-4'>
      <h3 className='text-basic-400 group-hover:text-primary-400 text-tm24 w-full transition-colors duration-150'>
        {title}
      </h3>
      <p className='text-t16 text-basic-300 group-hover:text-basic-400 w-full transition-colors duration-150'>
        {description}
      </p>
    </div>
    {resourceLinks.length > 0 && (
      <ul className='flex w-full flex-row flex-wrap gap-4'>
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
                target='_blank'
                rel='noreferrer'
                className='relative! z-20!'
              >
                {link.title}
              </Tag>
            </li>
          ))}
      </ul>
    )}
    {resourceLinks[0]?.url && (
      <a
        className='absolute inset-0 z-10 m-auto h-full w-full'
        href={resourceLinks[0].url}
        target='_blank'
        rel='noreferrer'
      />
    )}
  </div>
);

export default ProjectCard;
