import { defineI18n } from 'fumadocs-core/i18n';
import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';

export const docsI18n = defineI18n({
  defaultLanguage: 'ru',
  languages: ['ru', 'en'],
  hideLocale: 'always',
  fallbackLanguage: null,
});

const docs = defineDocs({ dir: 'content/docs' });

export const docsSource = loader({
  baseUrl: '/docs',
  i18n: docsI18n,
  source: docs.toFumadocsSource(),
  url: (slugs) => `/docs${slugs.length ? `/${slugs.join('/')}` : ''}`,
});

const ruPages = new Set(docsSource.getPages('ru').map((page) => page.slugs.join('/')));
const enPages = new Set(docsSource.getPages('en').map((page) => page.slugs.join('/')));
const missingRu = [...enPages].filter((slug) => !ruPages.has(slug));
const missingEn = [...ruPages].filter((slug) => !enPages.has(slug));

if (missingRu.length || missingEn.length) {
  throw new Error(
    `Documentation translation is missing. RU: ${missingRu.join(', ') || 'none'}; EN: ${missingEn.join(', ') || 'none'}`
  );
}
