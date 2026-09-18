'use client';

import { Button, Container } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import NextLink from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'cookie-consent';
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // год

// Согласие храним в технически необходимом cookie (как и описано в политике).
// useSyncExternalStore — рекомендованный React способ читать значение, которого нет
// на сервере: на сервере отдаём «согласие принято», поэтому баннер не попадает
// в SSR-разметку и не вызывает рассинхрон гидрации.
let listeners: Array<() => void> = [];

const subscribe = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
};

const getSnapshot = () => {
  try {
    return document.cookie.split('; ').some((entry) => entry === `${STORAGE_KEY}=1`);
  } catch {
    return false;
  }
};

const getServerSnapshot = () => true;

const acceptConsent = () => {
  try {
    document.cookie = `${STORAGE_KEY}=1;path=/;max-age=${CONSENT_MAX_AGE};samesite=lax`;
  } catch {
    /* cookie недоступны — баннер просто скроется в рамках сессии */
  }
  listeners.forEach((listener) => listener());
};

const CookieBanner = () => {
  const { t } = useTranslation();
  const accepted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [closing, setClosing] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Чистим таймер анимации, если компонент размонтируется до его срабатывания.
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  if (accepted) return null;

  // Сначала проигрываем анимацию ухода вниз, затем фиксируем согласие — баннер
  // размонтируется, когда `accepted` станет true. Длительность совпадает с duration-300.
  const handleAccept = () => {
    setClosing(true);
    timeoutRef.current = window.setTimeout(acceptConsent, 300);
  };

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 px-16 pt-16 pb-32 print:hidden'>
      <Container size='s'>
        <div
          className={clsx(
            'border-secondary-200 rounded-24 desktop:flex-row desktop:items-center bg-basic-0 pointer-events-auto flex w-full flex-col gap-16 border p-24 shadow-xl transition-all duration-300 ease-in',
            closing ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'
          )}
        >
          <div className='flex flex-1 flex-col gap-2'>
            <p className='text-tm16 text-basic-400'>{t('cookie.title')}</p>
            <p className='text-t14 text-basic-300 link'>
              {t('cookie.text')} <NextLink href='/privacy'>{t('cookie.more')}</NextLink>
            </p>
          </div>
          <Button
            size='m'
            color='primary'
            theme='light'
            className='w-max!'
            onClick={handleAccept}
          >
            {t('cookie.accept')}
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default CookieBanner;
