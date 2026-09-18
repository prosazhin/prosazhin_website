import { docsSource } from '@/lib/docs-source';
import { createFromSource } from 'fumadocs-core/search/server';

const search = createFromSource(docsSource, {
  buildIndex(page) {
    return {
      id: `${page.locale}:${page.url}`,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      structuredData: page.data.structuredData,
    };
  },
});

export const GET = search.GET;
