import Resume from '@/components/resume';
import { initTranslations } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';

const DesignerPage = async () => {
  const locale = await getLocale();

  return (
    <Resume
      profession='designer'
      locale={locale}
    />
  );
};

export async function generateMetadata() {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);

  return getMetadata({
    locale,
    title: t('resumeMeta.designer.title'),
    description: t('resumeMeta.designer.description'),
    pathname: '/designer',
  });
}

export default DesignerPage;
