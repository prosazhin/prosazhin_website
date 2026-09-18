import { initTranslations } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';
import { notFound } from 'next/navigation';

function NotFoundCatchAll() {
  notFound();
}

export async function generateMetadata() {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);

  return getMetadata({
    locale,
    title: `${t('pages:notFound.title')} | ${t('metaTitle')}`,
    description: t('metaDescription'),
    pathname: '/',
  });
}

export default NotFoundCatchAll;
