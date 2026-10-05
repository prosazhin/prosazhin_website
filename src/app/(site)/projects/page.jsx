import { initTranslations } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';
import { Container } from '@prosazhin/pbcomponents';
import ProjectList from './components/List';

const ProjectsPage = async () => {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);
  const { default: projectsBySlug } = await import('@/data/projects');

  const allProjects = t('projects:entries', { returnObjects: true })
    .map((entry) => {
      const extra = projectsBySlug[entry.slug];
      if (!extra) return null;

      return {
        slug: entry.slug,
        title: entry.title,
        role: entry.role,
        description: entry.description,
        order: extra.order,
        size: extra.size,
        accent: extra.accent,
        first: extra.first,
        href: extra.href ?? extra.resourceLinks?.[0]?.url,
        childSlugs: extra.children ?? [],
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

  // Проекты из children выводятся внутри карточки родителя, а не отдельными карточками.
  const nestedSlugs = new Set(allProjects.flatMap(({ childSlugs }) => childSlugs));
  const projects = allProjects
    .filter(({ slug }) => !nestedSlugs.has(slug))
    .map((project) => ({
      ...project,
      children: project.childSlugs
        .map((slug) => allProjects.find((item) => item.slug === slug))
        .filter(Boolean),
    }));

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
