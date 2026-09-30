'use client';

import { i18nConfig } from '@/i18n';
import { setLocaleCookie } from '@/utils/set-locale-cookie';
import { CheckIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Button, Popover } from '@prosazhin/pbcomponents';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const LangSwitch = () => {
  const router = useRouter();
  const {
    t,
    i18n: { language: lang },
  } = useTranslation();

  const switchLocale = (newLocale: string) => {
    setLocaleCookie(newLocale);
    router.refresh();
  };

  return (
    <Popover placement='bottom-end'>
      <Popover.Trigger>
        <Button
          size='xs'
          color='secondary'
          theme='border'
          textClassName='uppercase'
          rightIcon={ChevronUpDownIcon}
        >
          {lang}
        </Button>
      </Popover.Trigger>
      <Popover.Content className='w-160!'>
        {i18nConfig.locales.map((item: string) => (
          <Popover.Item
            key={item}
            onClick={() => switchLocale(item)}
            leftIcon={lang === item ? CheckIcon : undefined}
            leftIconClassName='!text-primary-400'
          >
            {t(`locales.${item}`)}
          </Popover.Item>
        ))}
      </Popover.Content>
    </Popover>
  );
};

export default LangSwitch;
