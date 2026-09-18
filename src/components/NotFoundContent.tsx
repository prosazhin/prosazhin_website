'use client';

import { Button, Container } from '@prosazhin/pbcomponents';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

const NotFoundContent = () => {
  const { t } = useTranslation();

  return (
    <Container size='s'>
      <h1 className='text-h48 text-basic-400 w-full'>{t('pages:notFound.title')}</h1>
      <Button
        size='m'
        color='secondary'
        theme='border'
        className='!mt-24'
        href='/'
        linkComponent={NextLink}
      >
        {t('goToHome')}
      </Button>
    </Container>
  );
};

export default NotFoundContent;
