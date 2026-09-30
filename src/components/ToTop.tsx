'use client';

import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { Button, Tooltip } from '@prosazhin/pbcomponents';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ToTop = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const handleScroll = () => {
    const offsetTop = window.pageYOffset;
    setShow(offsetTop > 500);
  };

  useEffect(() => {
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        handleScroll();
        throttleTimer = null;
      }, 200);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  return (
    <>
      {show && (
        <div className='desktop:bottom-24 desktop:right-24 pointer-events-none fixed right-16 bottom-16 z-50 w-64'>
          <Tooltip
            content={t('toTop')}
            placement='left'
          >
            <Button
              size='l'
              color='secondary'
              theme='ghost'
              className='pointer-events-auto! w-max!'
              leftIcon={ArrowUpIcon}
              aria-label={t('toTop')}
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
            />
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default ToTop;
