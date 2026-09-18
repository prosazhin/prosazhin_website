'use client';

import { TagType } from '@/types';
import getQuery from '@/utils/get-query';
import { Tag } from '@prosazhin/pbcomponents';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const linkType = ['link', 'compilation'];

const TagList = ({ tags }: { tags: TagType[] }) => {
  const params = useSearchParams();
  const type = params?.get('type');
  const activeTag = params?.get('tag');
  const query = params?.get('query');
  const { t } = useTranslation();

  return (
    <ul className='mt-12 mb-24 flex w-full flex-row flex-wrap gap-8'>
      {linkType.map((item) => (
        <li key={item}>
          <Tag
            size='m'
            theme='border'
            checked={type === item}
            href={getQuery(type === item ? null : item, query, activeTag)}
            linkComponent={NextLink}
          >
            {t(`linkType.${item}`)}
          </Tag>
        </li>
      ))}
      {tags.map(({ title, url }) => (
        <li key={url}>
          <Tag
            size='m'
            theme='border'
            checked={activeTag === url}
            href={getQuery(type, query, activeTag === url ? null : url)}
            linkComponent={NextLink}
          >
            {title}
          </Tag>
        </li>
      ))}
    </ul>
  );
};

export default TagList;
