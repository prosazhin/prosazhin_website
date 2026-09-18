import MobileControls from '@/components/docs/MobileControls';
import { initTranslations } from '@/i18n';
import { docsSource } from '@/lib/docs-source';
import type { LangType } from '@/types';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { notFound, redirect } from 'next/navigation';

type PageProps = { params: Promise<{ slug?: string[] }> };

export default async function DocumentationPage({ params }: PageProps) {
  const { slug = [] } = await params;
  if (slug.length === 0) redirect('/projects');

  const locale = await getLocale();
  const page = docsSource.getPage(slug, locale);
  if (!page) notFound();

  const Content = page.data.body;
  return (
    <DocsPage
      toc={page.data.toc}
      footer={{ enabled: false }}
    >
      <MobileControls label={locale === 'ru' ? 'Разделы' : 'Sections'} />
      <DocsTitle className='text-h32 desktop:text-h48'>{page.data.title}</DocsTitle>
      <DocsDescription className='text-t16 desktop:text-t20'>
        {page.data.description}
      </DocsDescription>
      <DocsBody>
        <Content components={defaultMdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const locale = await getLocale();
  const { slug = [] } = await params;
  const page = docsSource.getPage(slug, locale);
  if (!page) return {};

  const { t } = await initTranslations(locale);
  return getMetadata({
    locale: locale as LangType,
    title: `${page.data.title}${page.slugs.length > 1 ? ` — ${page.slugs[0]}` : ''} | ${t('metaTitle')}`,
    description: page.data.description ?? t('metaDescription'),
    pathname: page.url,
  });
}
