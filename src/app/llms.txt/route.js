import { i18nConfig, initTranslations } from '@/i18n';
import { docsSource } from '@/lib/docs-source';

const SITE_URL = 'https://prosazhin.dev';

// Язык — через ?lang=, как и на страницах сайта (proxy не обрабатывает пути с точкой,
// поэтому куку здесь не читаем). Без параметра — язык по умолчанию.
export async function GET(request) {
  const lang = request.nextUrl.searchParams.get('lang');
  const locale = lang && i18nConfig.locales.includes(lang) ? lang : i18nConfig.defaultLocale;
  const query = locale === i18nConfig.defaultLocale ? '' : `?lang=${locale}`;
  const abs = (url) => (url.startsWith('/') ? `${SITE_URL}${url}${query}` : url);

  const [{ t }, { default: projectsBySlug }, { default: posts }] = await Promise.all([
    initTranslations(locale),
    import('@/data/projects'),
    import('@/data/posts'),
  ]);

  const projects = t('projects:entries', { returnObjects: true })
    .map((entry) => ({ ...entry, extra: projectsBySlug[entry.slug] }))
    .sort((a, b) => a.extra.order - b.extra.order)
    .map(({ title, description, extra }) => {
      const url = extra.href ?? extra.resourceLinks[0]?.url;
      return `- [${title}](${abs(url)}): ${description}`;
    });

  const docs = docsSource.getPages(locale).map((page) => {
    const description = page.data.description ? `: ${page.data.description}` : '';
    return `- [${page.data.title}](${abs(page.url)})${description}`;
  });

  const body = `# ${t('name')}

> ${t('metaDescription')}

${t('location')}. ${t('remote')}. ${locale === 'ru' ? 'Почта' : 'Email'}: prosazhin@gmail.com. ${locale === 'ru' ? 'Полный текст сайта одним файлом' : 'Full site text in a single file'}: [llms-full.txt](${SITE_URL}/llms-full.txt${query}).

## ${t('footer.columns.about')}

- [${t('footer.links.resumeDeveloper')}](${abs('/')}): ${t('resumeMeta.developer.description')}
- [${t('footer.links.resumeDesigner')}](${abs('/designer')}): ${t('resumeMeta.designer.description')}
- [${t('footer.links.collaboration')}](${abs('/collaboration')}): ${t('collaboration:metaDescription')}

## ${t('pages:projects.title')}

${projects.join('\n')}

## ${t('projects:documentation')}

${docs.join('\n')}

## ${t('pages:posts.title')}

${posts.map((post) => `- [${post.title}](${post.url}): ${post.description}`).join('\n')}

## Optional

- [${t('pages:links.title')}](${abs('/links')})
- [${t('privacyPolicy')}](${abs('/privacy')})
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
