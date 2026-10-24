import { i18nConfig, initTranslations } from '@/i18n';
import { docsSource } from '@/lib/docs-source';
import { getFormatJobPeriod } from '@/utils/formatter';

const SITE_URL = 'https://prosazhin.dev';

const renderDetails = (details) =>
  details
    .map((detail) =>
      typeof detail === 'string'
        ? `- ${detail}`
        : [`- ${detail.text}`, ...(detail.items ?? []).map((item) => `  - ${item}`)].join('\n')
    )
    .join('\n');

// Полный текст сайта из тех же данных, что рендерят страницы: i18n-словари, src/data и MDX-документация.
// Язык — через ?lang=, без параметра — язык по умолчанию.
export async function GET(request) {
  const lang = request.nextUrl.searchParams.get('lang');
  const locale = lang && i18nConfig.locales.includes(lang) ? lang : i18nConfig.defaultLocale;
  const query = locale === i18nConfig.defaultLocale ? '' : `?lang=${locale}`;
  const abs = (url) => (url.startsWith('/') ? `${SITE_URL}${url}${query}` : url);

  const [
    { t },
    { default: contacts },
    { default: skillsByType },
    { default: careerByType },
    { default: projectsBySlug },
    { default: posts },
  ] = await Promise.all([
    initTranslations(locale),
    import('@/data/contacts'),
    import('@/data/skills'),
    import('@/data/career'),
    import('@/data/projects'),
    import('@/data/posts'),
  ]);

  const skills = t('skills:entries', { returnObjects: true }).map((entry) => {
    const tools = skillsByType[entry.type]?.tools ?? [];
    return `### ${entry.title}\n\n${entry.description}${tools.length ? `\n\n${tools.join(', ')}` : ''}`;
  });

  const career = t('career:entries', { returnObjects: true }).map((entry) => {
    const extra = careerByType[entry.type];
    const period = extra ? getFormatJobPeriod(extra.dateFrom, extra.dateTo, locale, t) : '';
    const positions = Object.entries(entry.positions ?? {}).map(([type, summary]) => {
      const stack = extra?.positions.find((position) => position.type === type)?.stack ?? [];
      return [
        `#### ${t(`career:positions.${type}`)}`,
        summary,
        entry.details?.[type] && renderDetails(entry.details[type]),
        stack.length && `${locale === 'ru' ? 'Стек' : 'Stack'}: ${stack.join(', ')}`,
      ]
        .filter(Boolean)
        .join('\n\n');
    });
    const summaries = Object.entries(entry.summary ?? {}).map(([, summary]) => summary);

    return [
      `### ${entry.title}${entry.subtitle ? ` — ${entry.subtitle}` : ''}`,
      [period, extra?.url].filter(Boolean).join(' · '),
      ...positions,
      ...summaries,
    ]
      .filter(Boolean)
      .join('\n\n');
  });

  const projects = t('projects:entries', { returnObjects: true })
    .map((entry) => ({ ...entry, extra: projectsBySlug[entry.slug] }))
    .sort((a, b) => a.extra.order - b.extra.order)
    .map(({ title, description, extra }) => {
      const links = extra.resourceLinks.map((link) => `[${link.title}](${abs(link.url)})`);
      return `### ${title}\n\n${description}${links.length ? `\n\n${links.join(' · ')}` : ''}`;
    });

  const docs = await Promise.all(
    docsSource.getPages(locale).map(async (page) => {
      // Из processed-markdown убираем якоря заголовков и одиночные JSX-компоненты (живые примеры).
      const text = (await page.data.getText('processed'))
        .replace(/ \[#[^\]]+\]$/gm, '')
        .replace(/^<[A-Z][^>]*\/>$/gm, '');
      return `### ${page.data.title}\n\n${abs(page.url)}\n\n${text}`;
    })
  );

  const body = `# ${t('name')}

> ${t('metaDescription')}

${t('location')}. ${t('remote')}.

## ${t('cv.contacts')}

${contacts.map((contact) => `- [${contact.title}](${contact.url})`).join('\n')}

## ${t('footer.columns.about')}

- [${t('footer.links.resumeDeveloper')}](${abs('/')})
- [${t('footer.links.resumeDesigner')}](${abs('/designer')})
- [${t('footer.links.collaboration')}](${abs('/collaboration')}): ${t('collaboration:metaDescription')}

## ${locale === 'ru' ? 'Навыки' : 'Skills'}

${skills.join('\n\n')}

## ${t('navCareer')}

${career.join('\n\n')}

## ${t('pages:projects.title')}

${projects.join('\n\n')}

## ${t('projects:documentation')}

${docs.join('\n\n')}

## ${t('pages:posts.title')}

${posts.map((post) => `- [${post.title}](${post.url}): ${post.description}`).join('\n')}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
