const nav = {
  projects: { url: '/projects', active: ['/projects'] },
  links: { url: '/links', active: ['/links'] },
  posts: { url: '/posts', active: ['/posts'] },
  about: { url: '/', active: ['/', '/designer'] },
};

export default nav;

// Колонки навигации в подвале: заголовок — footer.columns.<type>, ссылка — footer.links.<key>
// (для пакетов title задан явно — названия не переводятся).
export const footerNav = [
  {
    type: 'about',
    links: [
      { key: 'resumeDeveloper', url: '/' },
      { key: 'resumeDesigner', url: '/designer' },
      { key: 'projects', url: '/projects' },
      { key: 'links', url: '/links' },
      { key: 'posts', url: '/posts' },
    ],
  },
  {
    type: 'openSource',
    links: [
      { title: 'pbcomponents', url: '/docs/pbcomponents' },
      { title: 'pbstyles', url: '/docs/pbstyles' },
      { title: 'tailwind-dictionary', url: '/docs/tailwind-dictionary' },
      { title: 'mixin-dictionary', url: '/docs/mixin-dictionary' },
    ],
  },
  {
    type: 'products',
    links: [{ key: 'designSystem', url: '/design-system' }],
  },
];
