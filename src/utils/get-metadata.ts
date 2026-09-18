import { MetadataType } from '@/types';

const PROD = process.env.NEXT_PUBLIC_NODE_ENV === 'production';
const SITE_URL = PROD ? 'https://prosazhin.dev' : 'http://localhost:8080';
const SITE_NAME = 'prosazhin';
const YANDEX = '3bd565ceeb010e00';

const getMetadata = ({
  locale,
  title,
  description,
  pathname,
  isRobotsIndexPage = true,
}: MetadataType) => {
  const currentUrl = pathname === '/' ? SITE_URL : SITE_URL + pathname;
  const canonicalUrl = pathname ? currentUrl : false;
  const imageUrl = SITE_URL + `/sharing/${locale}.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: [
        { url: '/favicon/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { url: '/favicon/favicon-32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/favicon/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: canonicalUrl,
      locale: locale,
      images: [
        {
          url: imageUrl,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: isRobotsIndexPage,
      follow: isRobotsIndexPage,
      nocache: false,
      googleBot: {
        index: isRobotsIndexPage,
        follow: isRobotsIndexPage,
      },
    },
    verification: {
      yandex: YANDEX,
    },
    other: [
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'format-detection', content: 'address=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'google', content: 'notranslate' },
    ].reduce(
      (acc, { name, content }) => ({
        ...acc,
        [name]: content,
      }),
      {}
    ),
  };
};

export default getMetadata;
