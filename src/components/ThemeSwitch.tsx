'use client';

import { ThemeType } from '@/utils/get-theme';
import { setThemeCookie } from '@/utils/set-theme-cookie';
import { CheckIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Dropdown } from '@prosazhin/pbcomponents';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const THEMES: ThemeType[] = ['light', 'dark'];

const ThemeSwitch = ({ theme }: { theme: ThemeType }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const switchTheme = (newTheme: ThemeType) => {
    setThemeCookie(newTheme);
    router.refresh();
  };

  return (
    <Dropdown className='max-xs:w-max! flex! w-max!'>
      <Dropdown.Trigger
        size='xs'
        color='secondary'
        theme='border'
        leftIcon={theme === 'dark' ? MoonIcon : SunIcon}
      />
      <Dropdown.Content
        align='right'
        className='max-xs:w-160! w-160!'
      >
        {THEMES.map((item) => (
          <Dropdown.Item
            key={item}
            onClick={() => switchTheme(item)}
            leftIcon={theme === item ? CheckIcon : undefined}
            leftIconClassName='!text-primary-400'
          >
            {t(`themes.${item}`)}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  );
};

export default ThemeSwitch;
