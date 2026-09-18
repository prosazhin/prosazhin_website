/** @type {import('next-sitemap').IConfig} */

const PROD = process.env.NEXT_PUBLIC_NODE_ENV === 'production';
const SITE_URL = PROD ? 'https://prosazhin.dev' : 'http://localhost:8080';

const data = [
  {
    path: '/',
    priority: 1.0,
  },
  {
    path: '/designer',
    priority: 0.9,
  },
  {
    path: '/projects',
    priority: 0.8,
  },
  {
    path: '/posts',
    priority: 0.7,
  },
  {
    path: '/links',
    priority: 0.7,
  },
];

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  additionalPaths: async () => {
    const { readdirSync } = await import('node:fs');
    const { join } = await import('node:path');
    const result = [];

    data.forEach((item) => {
      result.push({
        loc: item.path,
        changefreq: 'daily',
        priority: item.priority,
        lastmod: new Date().toISOString(),
      });
    });

    const docsDir = join(__dirname, 'content/docs');
    const addDocs = (directory, segments = []) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          addDocs(join(directory, entry.name), [...segments, entry.name]);
        } else if (entry.name.endsWith('.mdx') && !entry.name.endsWith('.en.mdx')) {
          const name = entry.name.slice(0, -4);
          const slug = name === 'index' ? segments : [...segments, name];
          result.push({
            loc: `/docs${slug.length ? `/${slug.join('/')}` : ''}`,
            changefreq: 'weekly',
            priority: 0.6,
          });
        }
      }
    };

    addDocs(docsDir);

    return result;
  },
};
