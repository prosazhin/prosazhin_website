'use client';

import { i18nConfig } from '@/i18n';
import { setLocaleCookie } from '@/utils/set-locale-cookie';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '@prosazhin/pbcomponents';
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
    <Dropdown className='max-xs:w-max! flex! w-max!'>
      <Dropdown.Trigger
        size='xs'
        color='secondary'
        theme='border'
        textClassName='uppercase'
      >
        {lang}
      </Dropdown.Trigger>
      <Dropdown.Content
        align='right'
        className='max-xs:w-160! w-160!'
      >
        {i18nConfig.locales.map((item: string) => (
          <Dropdown.Item
            key={item}
            onClick={() => switchLocale(item)}
            leftIcon={lang === item ? CheckIcon : undefined}
            leftIconClassName='!text-primary-400'
          >
            {t(`locales.${item}`)}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  );
};

export default LangSwitch;
