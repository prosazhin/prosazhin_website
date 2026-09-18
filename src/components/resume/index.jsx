import Contacts from '@/components/Contacts';
import PageWithLeftAside from '@/components/PageWithLeftAside';
import LeftAside from '@/components/aside';
import CategoryList from '@/components/resume/CategoryList';
import JobCard from '@/components/resume/JobCard';
import ProjectCard from '@/components/resume/ProjectCard';
import RadarChart from '@/components/resume/RadarChart';
import { initTranslations } from '@/i18n';
import { getFormatJobPeriod } from '@/utils/formatter';
import {
  PROFESSIONS,
  RESUME_PROJECT_SLUGS,
  buildCareerBlocks,
  getTools,
  isSkillForProfession,
} from '@/utils/resume';
import { Badge, Collapse } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import Link from 'next/link';
import { Trans } from 'react-i18next/TransWithoutContext';

const Resume = async ({ profession, locale }) => {
  const { t, i18n } = await initTranslations(locale);
  const [
    { default: skillsByType },
    { default: careerByType, careerGroups },
    { default: contacts },
    { default: matrixData },
    { default: projectsBySlug },
  ] = await Promise.all([
    import('@/data/skills'),
    import('@/data/career'),
    import('@/data/contacts'),
    import('@/data/matrix'),
    import('@/data/projects'),
  ]);
  const tabIndex = PROFESSIONS.indexOf(profession);

  // Навыки, отфильтрованные по профессии.
  const skills = t('skills:entries', { returnObjects: true })
    .filter((entry) => isSkillForProfession(profession, entry.type))
    .map((entry) => {
      const extra = skillsByType[entry.type];

      return {
        type: entry.type,
        title: entry.title,
        navTitle: entry.navTitle ?? entry.title,
        description: entry.description,
        showTitle: extra?.title ?? false,
        tools: getTools(extra),
      };
    });

  const careerBlocks = buildCareerBlocks({
    entries: t('career:entries', { returnObjects: true }),
    careerByType,
    careerGroups,
    profession,
  });

  // Уровни оценки навыков (1–4): namespace matrix в клиентский бандл не отдаётся
  // (см. layout.jsx), поэтому клиентскому CategoryList передаём уже готовый список пропом.
  const levels = t('matrix:levels', { returnObjects: true });

  // Матрица компетенций выбранной профессии.
  const matrix = {
    type: profession,
    category: t(`matrix:${profession}`, { returnObjects: true }).map((cat, index) => ({
      id: String(index),
      title: cat.title,
      competencies: cat.competencies.map((comp) => ({
        id: comp.id,
        title: comp.title,
        rating: matrixData[profession][comp.id] ?? 0,
      })),
    })),
  };

  // Данные для радара: средняя оценка по каждой категории (в том же порядке,
  // что и нумерованный список в CategoryList).
  const radarData = matrix.category.map((cat) => ({
    title: cat.title,
    value: cat.competencies.reduce((acc, comp) => acc + comp.rating, 0) / cat.competencies.length,
  }));

  // Подпункты навигации: по одному на каждый верхнеуровневый блок карьеры
  // (сгруппированный этап или отдельное место работы).
  const careerNavItems = careerBlocks.map(({ id, jobs, grouped }) => ({
    type: id,
    title: grouped ? t(`career:groups.${id}.title`) : jobs[0].entry.title,
  }));

  // Набор проектов для каждой профессии задан в RESUME_PROJECT_SLUGS.
  const resumeProjects = t('projects:entries', { returnObjects: true })
    .filter((entry) => RESUME_PROJECT_SLUGS[profession].includes(entry.slug))
    .map((entry) => {
      const extra = projectsBySlug[entry.slug];

      return {
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        order: extra?.order ?? 0,
        resourceLinks: extra?.resourceLinks ?? [],
      };
    })
    .sort((a, b) => a.order - b.order);

  // Навигация: контакты (наверху страницы) + блоки навыков + карьера + проекты + матрица компетенций.
  const navItems = [
    { type: 'contacts', title: t('cv.contacts') },
    ...skills.map(({ type, navTitle }) => ({ type, title: navTitle })),
    { type: 'career', title: t('navCareer'), children: careerNavItems },
    { type: 'projects', title: t('pages:projects.title') },
    { type: 'matrix', title: t('navMatrix') },
  ];

  return (
    <PageWithLeftAside
      aside={
        <LeftAside
          data={navItems}
          profession={profession}
        />
      }
      size='s'
    >
      <h1
        id='contacts'
        className='sr-only scroll-mt-96'
      >
        {t('pages:index.professionDeveloper')}
        {t('pages:index.titleConnector')}
        {t('pages:index.professionDesigner')}
        {t('pages:index.titleTail')}
      </h1>
      <p className='text-t24 text-basic-400'>
        <Link
          href='/'
          className={clsx(
            'group relative inline-block box-decoration-clone px-8 no-underline',
            profession === 'developer' ? 'text-basic-0' : 'text-basic-400'
          )}
        >
          <span
            aria-hidden='true'
            className={clsx(
              'absolute inset-0 -z-10 -translate-x-2 rotate-1 transition-colors duration-150',
              profession === 'developer'
                ? 'bg-primary-300'
                : 'bg-secondary-100 group-hover:bg-secondary-200'
            )}
          />
          {t('pages:index.professionDeveloper')}
        </Link>
        {t('pages:index.titleConnector')}
        <Link
          href='/designer'
          className={clsx(
            'group relative inline-block box-decoration-clone px-8 no-underline',
            profession === 'designer' ? 'text-basic-0' : 'text-basic-400'
          )}
        >
          <span
            aria-hidden='true'
            className={clsx(
              'absolute inset-0 -z-10 -translate-x-2 -rotate-1 transition-colors duration-150',
              profession === 'designer'
                ? 'bg-primary-300'
                : 'bg-secondary-100 group-hover:bg-secondary-200'
            )}
          />
          {t('pages:index.professionDesigner')}
        </Link>
        {t('pages:index.titleTail')}
      </p>
      <p className='text-t24 text-basic-400 link mt-16 print:hidden'>
        <Trans
          t={t}
          i18n={i18n}
          i18nKey='pages:index.description'
          components={{
            links: <Link href='/links' />,
            posts: <Link href='/posts' />,
            projects: <Link href='/projects' />,
          }}
        />
      </p>
      <Contacts contacts={contacts} />
      <span
        className={clsx(
          'text-h64 hidden print:mt-230 print:block! print:pt-60',
          locale === 'en' && 'print:mt-230'
        )}
      >
        {t('tabs.resume', { returnObjects: true })[tabIndex].title}
      </span>

      {/* Навыки */}
      <ul className='mt-80 flex flex-col gap-y-40'>
        {skills.map(({ type, title, description, showTitle, tools }) => (
          <li
            className='flex w-full scroll-mt-96 flex-col gap-y-20'
            key={type}
            id={type}
          >
            <div className='flex w-full flex-col gap-y-12'>
              {showTitle && <h2 className='text-h24 text-basic-400 w-full'>{title}</h2>}
              <p className='text-t20 text-basic-400 w-full'>{description}</p>
            </div>
            {tools.length > 0 && (
              <ul className='flex w-full flex-row flex-wrap gap-4'>
                {tools.map((tool) => (
                  <li key={tool}>
                    <Badge
                      size='s'
                      color='secondary'
                      theme='light'
                      className='print:border-secondary-200 print:border'
                    >
                      {tool}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Каждый этап — карточка. В проектном этапе работы разделены внутри неё. */}
      <article
        className='mt-80 flex w-full scroll-mt-96 flex-col gap-y-16'
        id='career'
      >
        <h2 className='sr-only'>{t('pages:career.title')}</h2>
        {careerBlocks.map(({ id, jobs, grouped, dateFrom, dateTo }) => {
          if (!grouped) {
            return (
              <div
                className='border-secondary-200 rounded-16 sm-min:px-32 flex w-full flex-col border px-24 py-24'
                key={id}
              >
                <JobCard
                  job={jobs[0]}
                  locale={locale}
                  t={t}
                />
              </div>
            );
          }

          const period = getFormatJobPeriod(dateFrom, dateTo, locale, t);

          return (
            <div
              className='border-secondary-200 rounded-16 flex w-full scroll-mt-96 flex-col overflow-hidden border'
              key={id}
              id={id}
            >
              <div className='bg-secondary-50 sm-min:px-32 flex w-full flex-col px-24 py-24'>
                <div className='flex w-full flex-col gap-y-8'>
                  <span className='text-t16 text-basic-300 w-full'>{period}</span>
                  <h3 className='text-h32 text-basic-400 w-full'>
                    {t(`career:groups.${id}.title`)}
                  </h3>
                </div>
              </div>
              <div className='divide-secondary-200 flex w-full flex-col divide-y'>
                {jobs.map((job) => (
                  <div
                    className='sm-min:px-32 px-24 py-20'
                    key={job.entry.type}
                  >
                    <JobCard
                      job={job}
                      locale={locale}
                      t={t}
                      showPeriod={false}
                      nested
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </article>

      {/* Проекты */}
      <h2
        className='text-h24 text-basic-400 mt-80 w-full scroll-mt-96'
        id='projects'
      >
        {t('pages:projects.title')}
      </h2>
      <ul className='mt-16 flex w-full flex-col gap-16'>
        {resumeProjects.map(({ slug, title, description, resourceLinks }) => (
          <li key={slug}>
            <ProjectCard
              title={title}
              description={description}
              resourceLinks={resourceLinks}
            />
          </li>
        ))}
      </ul>

      {/* Матрица компетенций */}
      <h2
        className='text-h24 text-basic-400 mt-80 w-full scroll-mt-96'
        id='matrix'
      >
        {t(`pages:${profession}.title`)}
      </h2>
      <div className='mt-16 flex flex-col gap-16 print:hidden'>
        <Collapse summary={t('matrix:about')}>
          <p
            className='text-t16 text-basic-400 link'
            dangerouslySetInnerHTML={{ __html: t('matrix:matrixDescription') }}
          />
        </Collapse>
        <Collapse summary={t('matrix:headline')}>
          <ul className='flex w-full flex-col gap-16'>
            {levels.map((level) => (
              <li
                className='flex w-full flex-col gap-4'
                key={level.title}
              >
                <span className='text-tm16 text-basic-400'>{level.title}</span>
                <span className='text-t16 text-basic-400'>{level.description}</span>
              </li>
            ))}
          </ul>
        </Collapse>
      </div>
      <RadarChart
        data={radarData}
        max={4}
        locale={locale}
        title={t(`pages:${profession}.title`)}
      />
      <CategoryList
        matrix={matrix}
        levels={levels}
        locale={locale}
      />
    </PageWithLeftAside>
  );
};

export default Resume;
