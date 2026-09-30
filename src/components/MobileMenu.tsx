'use client';

import Nav from '@/components/Nav';
import { Bars2Icon } from '@heroicons/react/24/outline';
import { Button, Dialog, useShowDialog } from '@prosazhin/pbcomponents';
import { useTranslation } from 'react-i18next';

const MobileMenu = ({ nav }: { nav: Record<string, { url: string; active: string[] }> }) => {
  const { t } = useTranslation();
  const showDialog = useShowDialog(
    () => (
      <Dialog id='mobile-menu'>
        <Nav nav={nav} />
      </Dialog>
    ),
    [nav]
  );

  return (
    <>
      <Button
        size='s'
        color='secondary'
        theme='ghost'
        leftIcon={Bars2Icon}
        aria-label={t('menu')}
        className='desktop:hidden!'
        onClick={showDialog}
      />
    </>
  );
};

export default MobileMenu;
