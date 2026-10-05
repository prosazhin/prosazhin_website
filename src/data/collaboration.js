// Ссылки и проекты страницы «Сотрудничество». Подписи — в namespace collaboration:
// contact.links.<key> — блок «Ещё обо мне»; названия и описания проектов — из namespace projects.
export const DESIGN_SYSTEM_URL = '/design-system';

export const projectLinks = {
  // Пакеты внутри карточки дизайн-системы
  designSystem: [
    { slug: 'pbcomponents', url: '/docs/pbcomponents' },
    { slug: 'pbstyles', url: '/docs/pbstyles' },
  ],
  // Генераторы тем — отдельными карточками
  tools: [
    { slug: 'tailwind-dictionary', url: '/tailwind-dictionary' },
    { slug: 'mixin-dictionary', url: '/docs/mixin-dictionary' },
  ],
};

export const moreLinks = [
  { key: 'resumeDeveloper', url: '/' },
  { key: 'resumeDesigner', url: '/designer' },
  { key: 'designSystem', url: DESIGN_SYSTEM_URL },
  { key: 'tailwindDictionary', url: '/tailwind-dictionary' },
  { key: 'projects', url: '/projects' },
  { key: 'github', url: 'https://github.com/prosazhin' },
];
