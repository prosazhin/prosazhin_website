'use client';

import { Button } from '@prosazhin/pbcomponents';
import NextLink from 'next/link';

// Кнопки-ссылки на документацию. Клиентский компонент, потому что linkComponent
// нельзя передать пропом из Server Component.
const ActionButtons = ({
  items,
}: {
  items: Array<{ title: string; url: string; primary?: boolean }>;
}) => (
  <div className='flex flex-row flex-wrap gap-8'>
    {items.map(({ title, url, primary }) => (
      <Button
        key={url}
        size='m'
        color='primary'
        theme={primary ? 'filled' : 'light'}
        href={url}
        linkComponent={NextLink}
        // У Button в pbcomponents на телефоне w-full — здесь кнопки не растягиваются.
        className='max-xs:w-auto!'
      >
        {title}
      </Button>
    ))}
  </div>
);

export default ActionButtons;
