import { initTranslations } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';
import { Container } from '@prosazhin/pbcomponents';

const PrivacyPage = async () => {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);
  const sections = t('privacy:sections', { returnObjects: true });

  return (
    <Container size='s'>
      <article className='flex w-full flex-col gap-y-32'>
        <header className='flex w-full flex-col gap-y-12'>
          <h1 className='text-h32 text-basic-400'>{t('privacy:title')}</h1>
          <p className='text-t16 text-basic-400'>{t('privacy:intro')}</p>
          <span className='text-t16 text-basic-300'>{t('privacy:updated')}</span>
        </header>
        {sections.map(({ heading, body }) => (
          <section
            className='flex w-full flex-col gap-y-12'
            key={heading}
          >
            <h2 className='text-h20 text-basic-400'>{heading}</h2>
            {body.map((paragraph) => (
              <p
                className='text-t16 text-basic-400 link'
                key={paragraph}
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </section>
        ))}
      </article>
    </Container>
  );
};

export async function generateMetadata() {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);

  return getMetadata({
    locale,
    title: `${t('privacy:title')} | ${t('metaTitle')}`,
    description: t('privacy:intro'),
    pathname: '/privacy',
  });
}

export default PrivacyPage;
