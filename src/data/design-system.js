// Страница /design-system. Ссылки на библиотеки берутся из projects.js по slug,
// тексты — из namespace `design-system`.

export const INSTALL_COMMAND = 'npm i @prosazhin/pbcomponents @prosazhin/pbstyles';

// Порядок карточек в блоке «Состав»; accent — крупная карточка на фоне.
export const libraries = [
  { slug: 'pbstyles', accent: true },
  { slug: 'pbcomponents', accent: true },
  { slug: 'tailwind-dictionary', accent: false },
  { slug: 'mixin-dictionary', accent: false },
];

// Блок «Путь одного цвета» на первом экране: как primary-300 называется на каждом шаге
// (подписи — flow.items[i]). На последнем шаге вместо кода рендерится настоящая кнопка.
export const flowSteps = [
  { code: 'primary/300', swatch: true },
  { code: 'color.primary.300' },
  { code: '--color-primary-300' },
  { code: 'bg-primary-300' },
  { button: true },
];

// Шаги блока «Как это устроено» (тексты — cycle.steps[i], подписи ссылок — cycle.links.<key>):
// ссылки и фрагменты реальных файлов.
export const cycleSteps = [
  {
    links: [
      { key: 'figmaStyles', url: 'https://www.figma.com/community/file/1213609862805339771' },
      { key: 'figmaComponents', url: 'https://www.figma.com/community/file/1214486013859546496' },
    ],
  },
  {
    file: 'tokens/themes/dark.json',
    code: `{
  "color": {
    "$type": "color",
    "primary": {
      "50":  { "$value": "{color.blue.950}" },
      "300": { "$value": "{color.blue.400}" },
      "400": { "$value": "{color.blue.300}" }
    }
  }
}`,
  },
  {
    file: 'config-tailwind-dictionary.json',
    code: `{
  "version": 4,
  "source": ["tokens/*.json"],
  "themes": {
    "light": ["tokens/themes/light.json"],
    "dark": ["tokens/themes/dark.json"]
  },
  "output": "./styles"
}`,
    links: [
      { key: 'tailwindDictionary', url: '/docs/tailwind-dictionary' },
      { key: 'mixinDictionary', url: '/docs/mixin-dictionary' },
      { key: 'playground', url: '/docs/tailwind-dictionary/playground' },
    ],
  },
  {
    file: 'globals.css',
    code: `@import 'tailwindcss';
@import '@prosazhin/pbstyles/styles/tailwind/theme.css';`,
    links: [{ key: 'pbstyles', url: '/docs/pbstyles' }],
  },
  {
    file: 'page.tsx',
    code: `import { Button } from '@prosazhin/pbcomponents';

<Button size='m' color='primary' theme='filled'>
  Save
</Button>`,
    links: [{ key: 'pbcomponents', url: '/docs/pbcomponents' }],
  },
  {
    links: [{ key: 'site', url: 'https://github.com/prosazhin/prosazhin_website' }],
  },
];
