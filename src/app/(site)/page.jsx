import Resume from '@/components/resume';
import { initTranslations } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';

const IndexPage = async () => {
  const locale = await getLocale();

  return (
    <Resume
      profession='developer'
      locale={locale}
    />
  );
};

export async function generateMetadata() {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);

  return getMetadata({
    locale,
    title: t('resumeMeta.developer.title'),
    description: t('resumeMeta.developer.description'),
    pathname: '/',
  });
}

export default IndexPage;
