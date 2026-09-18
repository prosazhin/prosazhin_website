import careerByType, { careerGroups } from '@/data/career';
import { cvContacts } from '@/data/contacts';
import projectsBySlug from '@/data/projects';
import skillsByType from '@/data/skills';
import { getFormatJobPeriod, getYearsDiff } from '@/utils/formatter';
import {
  RESUME_PROJECT_SLUGS,
  buildCareerBlocks,
  getTools,
  isSkillForProfession,
} from '@/utils/resume';
import React from 'react';

const PrintableResume = ({ locale, profession, t }) => {
  const skills = t('skills:entries', { returnObjects: true })
    .filter((entry) => isSkillForProfession(profession, entry.type))
    .map((entry) => ({ ...entry, tools: getTools(skillsByType[entry.type]) }));

  const careerBlocks = buildCareerBlocks({
    entries: t('career:entries', { returnObjects: true }),
    careerByType,
    careerGroups,
    profession,
  });

  const projects = t('projects:entries', { returnObjects: true })
    .filter((entry) => RESUME_PROJECT_SLUGS[profession].includes(entry.slug))
    .map((entry) => ({ ...entry, ...projectsBySlug[entry.slug] }))
    .sort((a, b) => a.order - b.order);

  const renderJob = ({ entry, extra, positions }, showPeriod = true) => (
    <section
      className='cv-job'
      key={entry.type}
    >
      <div className='cv-job-heading'>
        {showPeriod && (
          <p className='cv-date'>{getFormatJobPeriod(extra.dateFrom, extra.dateTo, locale, t)}</p>
        )}
        <h3>{extra.url ? <a href={extra.url}>{entry.title}</a> : entry.title}</h3>
        {entry.subtitle && <p className='cv-subtitle'>{entry.subtitle}</p>}
      </div>
      {positions.map((position) => (
        <div
          className='cv-position'
          key={position.type}
        >
          <h4>{t(`career:positions.${position.type}`)}</h4>
          {entry.positions?.[position.type] && <p>{entry.positions[position.type]}</p>}
          {entry.details?.[position.type]?.length > 0 && (
            <ul className='cv-details'>
              {entry.details[position.type].map((detail, index) => {
                const { text, items } = typeof detail === 'string' ? { text: detail } : detail;
                return (
                  <li key={index}>
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                    {items?.length > 0 && (
                      <ul>
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {position.stack.length > 0 && <p className='cv-stack'>{position.stack.join(' · ')}</p>}
        </div>
      ))}
    </section>
  );

  return (
    <main className='cv-page'>
      <header className='cv-header'>
        <p className='cv-eyebrow'>{t(`jobTitle.${profession}`)}</p>
        <h1>{t('name')}</h1>
        <p className='cv-intro'>
          {t('location')} · {t('remote')} ·{' '}
          {t('plurals.year.year', {
            count: getYearsDiff(
              profession === 'developer' ? '2014-01-01' : '2011-01-01',
              String(new Date())
            ),
          })}{' '}
          {t(profession === 'developer' ? 'inDevelopment' : 'inDesign')}
        </p>
        <p className='cv-tags'>
          {(t(`jobTags.${profession}`, { returnObjects: true }) || []).join(' · ')}
        </p>
      </header>

      <section className='cv-section cv-contacts'>
        <h2>{t('cv.contacts')}</h2>
        {/* Простой текст строками, без ссылок: ATS читает текстовый слой, а не link-аннотации PDF. */}
        <ul className='cv-links'>
          {cvContacts.map(({ title, url, link }) => (
            <li key={url}>
              {link ? `${title}: ${url.replace(/^https?:\/\/(www\.)?/, '')}` : title}
            </li>
          ))}
        </ul>
      </section>

      <section className='cv-section'>
        <h2>{t('cv.skills')}</h2>
        {skills.map(({ type, title, description, tools }) => (
          <div
            className='cv-skill'
            key={type}
          >
            <h3>{title}</h3>
            <p>{description}</p>
            {tools.length > 0 && <p className='cv-stack'>{tools.join(' · ')}</p>}
          </div>
        ))}
      </section>

      <section className='cv-section'>
        <h2>{t('pages:career.title')}</h2>
        {careerBlocks.map((block) =>
          block.grouped ? (
            <div
              className='cv-group'
              key={block.id}
            >
              <div className='cv-group-heading'>
                <p className='cv-date'>
                  {getFormatJobPeriod(block.dateFrom, block.dateTo, locale, t)}
                </p>
                <h3>{t(`career:groups.${block.id}.title`)}</h3>
              </div>
              {block.jobs.map((job) => renderJob(job, false))}
            </div>
          ) : (
            renderJob(block.jobs[0])
          )
        )}
      </section>

      <section className='cv-section'>
        <h2>{t('pages:projects.title')}</h2>
        {projects.map(({ slug, title, description, resourceLinks = [] }) => (
          <div
            className='cv-project'
            key={slug}
          >
            <h3>
              {resourceLinks[0]?.url ? (
                <a
                  href={
                    resourceLinks[0].url.startsWith('/')
                      ? `https://prosazhin.dev${resourceLinks[0].url}`
                      : resourceLinks[0].url
                  }
                >
                  {title}
                </a>
              ) : (
                title
              )}
            </h3>
            <p>{description}</p>
            {resourceLinks.some(({ url }) => !url.startsWith('/docs/')) && (
              <p className='cv-project-links'>
                {resourceLinks
                  .filter(({ url }) => !url.startsWith('/docs/'))
                  .map(({ url, title: linkTitle }) => (
                    <a
                      href={url}
                      key={url}
                    >
                      {linkTitle}
                    </a>
                  ))}
              </p>
            )}
          </div>
        ))}
      </section>
    </main>
  );
};

export default PrintableResume;
