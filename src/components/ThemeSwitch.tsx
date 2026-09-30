'use client';

import { ThemeType } from '@/utils/get-theme';
import { setThemeCookie } from '@/utils/set-theme-cookie';
import { CheckIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Button, Popover } from '@prosazhin/pbcomponents';
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
    <Popover placement='bottom-end'>
      <Popover.Trigger>
        <Button
          size='xs'
          color='secondary'
          theme='border'
          leftIcon={theme === 'dark' ? MoonIcon : SunIcon}
          rightIcon={ChevronUpDownIcon}
          aria-label={t('themes.label')}
        />
      </Popover.Trigger>
      <Popover.Content className='w-160!'>
        {THEMES.map((item) => (
          <Popover.Item
            key={item}
            onClick={() => switchTheme(item)}
            leftIcon={theme === item ? CheckIcon : undefined}
            leftIconClassName='!text-primary-400'
          >
            {t(`themes.${item}`)}
          </Popover.Item>
        ))}
      </Popover.Content>
    </Popover>
  );
};

export default ThemeSwitch;
