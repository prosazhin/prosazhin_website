import Image from 'next/image';
import NextLink from 'next/link';

import { LangType } from '@/types';
import { ThemeType } from '@/utils/get-theme';
import { Container } from '@prosazhin/pbcomponents';

import LangSwitch from '@/components/LangSwitch';
import MobileMenu from '@/components/MobileMenu';
import Nav from '@/components/Nav';
import ThemeSwitch from '@/components/ThemeSwitch';

// Логотипы лежат в /public/logo как `{variant}-{lang}-{theme}.svg` (иконки без языка).
// Варианты по убыванию ширины экрана:
//   full      (≥ 1441px)  — знак <prosazhin /> + имя + должность
//   short     (921–1440)  — иконка </> + имя + должность
//   icon-wide (480–920)   — только знак <prosazhin />
//   icon      (< 480)     — только иконка </>
// Все SVG высотой 72, ширина — реальная ширина контента: пропсы width/height должны
// совпадать с соотношением сторон SVG, иначе при `w-auto` отрендеренная ширина
// расходится с атрибутом и Next ругается на aspect ratio.
type LogoVariant = 'full' | 'short' | 'icon-wide' | 'icon';

const LOGO_HEIGHT = 72;

const LOGO_WIDTH: Record<LogoVariant, number | Record<LangType, number>> = {
  full: { ru: 640, en: 600 },
  short: { ru: 395, en: 355 },
  'icon-wide': 337,
  icon: 92,
};

const LOGO_CLASS: Record<LogoVariant, string> = {
  full: 'xl:block hidden print:block',
  short: 'lg-min:block xl:hidden hidden print:hidden',
  'icon-wide': 'max-xs:hidden lg-min:hidden block print:hidden',
  icon: 'max-xs:block hidden print:hidden',
};

const LOGO_VARIANTS = Object.keys(LOGO_WIDTH) as LogoVariant[];

const logoSrc = (variant: LogoVariant, locale: LangType, theme: ThemeType) => {
  const width = LOGO_WIDTH[variant];
  return typeof width === 'number'
    ? { src: `/logo/${variant}-${theme}.svg`, width }
    : { src: `/logo/${variant}-${locale}-${theme}.svg`, width: width[locale] };
};

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
          <NextLink
            href='/'
            className='h-40 w-auto no-underline'
          >
            {LOGO_VARIANTS.map((variant) => {
              const { src, width } = logoSrc(variant, locale, theme);
              return (
                <Image
                  key={variant}
                  src={src}
                  alt='Logotype'
                  width={width}
                  height={LOGO_HEIGHT}
                  className={`${LOGO_CLASS[variant]} h-full w-auto`}
                  loading='eager'
                />
              );
            })}
          </NextLink>
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
