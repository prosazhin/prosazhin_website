'use client';

import { CompilationType, LinkType, TagType } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import Compilation from './Compilation';
import Link from './Link';

const List = ({ data }: { data: LinkType[] | CompilationType[] }) => {
  const params = useSearchParams();
  const type = params?.get('type');
  const activeTag = params?.get('tag');
  const query = params?.get('query');

  const filteredData = useMemo(() => {
    let result = [...data];

    if (type) {
      result = result.filter(({ type: itemType }) => itemType === type);
    }

    if (activeTag) {
      result = result.filter(({ tags }) => tags.some((tag: TagType) => activeTag === tag.url));
    }

    if (query) {
      result = result.filter(({ title, description }) => {
        return (
          title.toLowerCase().includes(query.toLowerCase()) ||
          (description && description.toLowerCase().includes(query.toLowerCase()))
        );
      });
    }

    return result.sort((a, b) => +new Date(b.create) - +new Date(a.create));
  }, [data, activeTag, query, type]);

  return (
    <div className='max-xs:grid-cols-1 sm-min:grid-cols-2 md-min:grid-cols-3 lg-min:grid-cols-3 mt-24 grid grid-flow-dense gap-24 xl:grid-cols-4'>
      {filteredData.map((item) => {
        const { type } = item;

        if (type === 'compilation') {
          return (
            <Compilation
              {...item}
              key={item.id}
              activeTag={activeTag}
              className='max-xs:col-span-1 col-span-2'
            />
          );
        }

        return (
          <Link
            {...item}
            key={(item as LinkType).url}
            activeTag={activeTag}
          />
        );
      })}
    </div>
  );
};

export default List;
