import { LangType } from '@/types';
import { ThemeType } from '@/utils/get-theme';
import { Container } from '@prosazhin/pbcomponents';

import LangSwitch from '@/components/LangSwitch';
import Logo from '@/components/Logo';
import MobileMenu from '@/components/MobileMenu';
import Nav from '@/components/Nav';
import ThemeSwitch from '@/components/ThemeSwitch';

const Header = ({
  locale,
  theme,
  nav,
}: {
  locale: LangType;
  theme: ThemeType;
  nav: Record<string, { url: string; active: string[] }>;
}) => (
  <header className='border-secondary-200 group bg-basic-0 fixed top-0 z-40 block h-72 w-full border-b py-16 transition-colors duration-150 print:relative'>
    <Container size='m'>
      <div className='flex w-full flex-row items-center gap-x-24'>
        <div className='inline-flex h-40 flex-1 items-center justify-start'>
          <Logo
            locale={locale}
            theme={theme}
          />
        </div>
        <div className='flex flex-row items-center gap-x-24 print:hidden'>
          <div className='flex flex-row items-center gap-x-8'>
            <ThemeSwitch theme={theme} />
            <LangSwitch />
          </div>
          <MobileMenu nav={nav} />
        </div>
        <Nav
          nav={nav}
          className='desktop:flex hidden print:hidden'
        />
      </div>
    </Container>
  </header>
);

export default Header;
