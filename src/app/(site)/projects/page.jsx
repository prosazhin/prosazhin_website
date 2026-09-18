import { initTranslations } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';
import { Container } from '@prosazhin/pbcomponents';
import ProjectList from './components//List';

const ProjectsPage = async () => {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);
  const { default: projectsBySlug } = await import('@/data/projects');

  const projects = t('projects:entries', { returnObjects: true })
    .map((entry) => {
      const extra = projectsBySlug[entry.slug];
      if (!extra) return null;

      return {
        title: entry.title,
        description: entry.description,
        order: extra.order,
        size: extra.size,
        accent: extra.accent,
        first: extra.first,
        tags: (extra.tags || []).map((s) => ({
          title: s,
          url: `#${s.toLowerCase().replace(/\s+/g, '-')}`,
        })),
        resourceLinks: (extra.resourceLinks || []).map((link) => ({
          title: link.title === 'docs' ? t('projects:documentation') : link.title,
          url: link.url,
        })),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  return (
    <Container size='m'>
      <h1 className='sr-only'>{t('pages:projects.title')}</h1>
      <span className='text-h64 hidden print:mt-[100dvh] print:block! print:pt-20 print:pb-20'>
        {t('pages:projects.title')}
      </span>
      <ProjectList projects={projects} />
    </Container>
  );
};

export async function generateMetadata() {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);

  return getMetadata({
    locale,
    title: `${t('pages:projects.title')} | ${t('metaTitle')}`,
    description: t('metaDescription'),
    pathname: '/projects',
  });
}

export default ProjectsPage;
