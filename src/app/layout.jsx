import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import ToTop from '@/components/ToTop';
import TranslationsProvider from '@/components/TranslationsProvider';
import { initTranslations } from '@/i18n';
import '@/styles/docs.css';
import '@/styles/globals.css';
import { getLocale } from '@/utils/get-locale';
import { getTheme } from '@/utils/get-theme';
import { PBCProvider } from '@prosazhin/pbcomponents';
import { dir } from 'i18next';
import { Inter } from 'next/font/google';

// Шрифт самохостится через next/font (вшивается в бандл на сборке) — запрос к Google Fonts
// не выполняется, IP посетителя за рубеж не уходит (без трансграничной передачи ПДн по 152-ФЗ).
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// Локаль читается из cookie NEXT_LOCALE — layout должен рендериться динамически на каждый запрос
export const dynamic = 'force-dynamic';

const RootLayout = async ({ children }) => {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  const [{ resources: resourceStore }, { default: nav }] = await Promise.all([
    initTranslations(locale),
    import('@/data/nav'),
  ]);
  // В клиентский бандл сериализуем только namespaces, нужные client-компонентам
  // (common — дефолтный для всех; pages — для NotFoundContent). Тяжёлые matrix/career
  // используются только на сервере через t(), поэтому в документ их не отдаём.
  const localeResources = resourceStore[locale] ?? {};
  const resources = {
    [locale]: {
      common: localeResources.common,
      pages: localeResources.pages,
    },
  };

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      data-theme={theme}
      className={`${inter.variable} scroll-smooth${theme === 'dark' ? ' dark' : ''}`}
      data-scroll-behavior='smooth'
    >
      <body>
        <TranslationsProvider
          key={locale}
          locale={locale}
          resources={resources}
        >
          <PBCProvider notifications={{ top: 80 }}>
            <Header
              locale={locale}
              theme={theme}
              nav={nav}
            />
            {children}
            <Footer locale={locale} />
            <CookieBanner />
          </PBCProvider>
        </TranslationsProvider>
        <ScrollToTop />
        <ToTop />
      </body>
    </html>
  );
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default RootLayout;
