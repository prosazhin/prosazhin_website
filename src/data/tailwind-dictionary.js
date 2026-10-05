// Страница /tailwind-dictionary. Тексты — namespace `tailwind-dictionary`.
// Фрагменты кода совпадают с реальным выводом пакета (generate() из tailwind-dictionary 2.6):
// при изменении токенов демо пересоберите вывод, а не правьте его вручную.

export const INSTALL_COMMAND = 'npm i -D tailwind-dictionary';

export const links = {
  docs: '/docs/tailwind-dictionary',
  playground: '/docs/tailwind-dictionary/playground',
  themes: '/docs/tailwind-dictionary/themes',
  figma: '/docs/tailwind-dictionary/figma',
  config: '/docs/tailwind-dictionary/config',
  designSystem: '/design-system',
  pbstylesConfig: 'https://github.com/prosazhin/pbstyles/blob/main/config-tailwind-dictionary.json',
  github: 'https://github.com/prosazhin/tailwind-dictionary',
  npm: 'https://www.npmjs.com/package/tailwind-dictionary',
  changelog: 'https://github.com/prosazhin/tailwind-dictionary/blob/main/CHANGELOG.md',
};

// Демо на первом экране: вход — три файла токенов, выход — тема для Tailwind 4 или 3.
export const demoInput = [
  {
    file: 'tokens.json',
    code: `{
  "color": {
    "$type": "color",
    "white": { "$value": "#ffffff" },
    "gray": { "900": { "$value": "#111827" } },
    "blue": {
      "400": { "$value": "#60a5fa" },
      "600": { "$value": "#2563eb" }
    }
  },
  "radius": {
    "$type": "dimension",
    "12": { "$value": { "value": 12, "unit": "px" } }
  }
}`,
  },
  {
    file: 'themes/light.json',
    code: `{
  "color": {
    "$type": "color",
    "background": { "$value": "{color.white}" },
    "primary": { "$value": "{color.blue.600}" }
  }
}`,
  },
  {
    file: 'themes/dark.json',
    code: `{
  "color": {
    "$type": "color",
    "background": { "$value": "{color.gray.900}" },
    "primary": { "$value": "{color.blue.400}" }
  }
}`,
  },
];

export const demoOutput = {
  4: [
    {
      file: 'tailwind/theme.css',
      code: `:root {
  --theme-color-background: #ffffff;
  --theme-color-primary: #2563eb;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --theme-color-background: #111827;
    --theme-color-primary: #60a5fa;
  }
}

[data-theme='dark'] {
  --theme-color-background: #111827;
  --theme-color-primary: #60a5fa;
}

[data-theme='light'] {
  --theme-color-background: #ffffff;
  --theme-color-primary: #2563eb;
}

@theme {
  --*: initial;

  --color-*: initial;
  --color-white: #ffffff;
  --color-gray-900: #111827;
  --color-blue-400: #60a5fa;
  --color-blue-600: #2563eb;

  --radius-12: 12px;
}

@theme inline {
  --color-background: var(--theme-color-background);
  --color-primary: var(--theme-color-primary);
}`,
    },
  ],
  // theme.js пакет пишет одной строкой — здесь тот же объект с переносами для читаемости.
  3: [
    {
      file: 'tailwind/theme.js',
      code: `module.exports = {
  colors: {
    white: '#ffffff',
    gray: { 900: '#111827' },
    blue: { 400: '#60a5fa', 600: '#2563eb' },
    background: 'var(--color-background)',
    primary: 'var(--color-primary)',
  },
  borderRadius: { 12: '12px' },
};`,
    },
    {
      file: 'tailwind/theme.css',
      code: `:root {
  --color-background: #ffffff;
  --color-primary: #2563eb;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --color-background: #111827;
    --color-primary: #60a5fa;
  }
}

[data-theme='dark'] {
  --color-background: #111827;
  --color-primary: #60a5fa;
}

[data-theme='light'] {
  --color-background: #ffffff;
  --color-primary: #2563eb;
}`,
    },
  ],
};

// Шаги блока «Из Figma в код» (тексты — steps.items[i]).
export const steps = [
  {
    file: 'tokens/',
    code: `Primitives.tokens.json
Light.tokens.json
Dark.tokens.json`,
    link: 'figma',
  },
  {
    file: 'config.json',
    code: `{
  "version": 4,
  "source": ["tokens/Primitives.tokens.json"],
  "themes": {
    "light": ["tokens/Light.tokens.json"],
    "dark": ["tokens/Dark.tokens.json"]
  },
  "output": "./styles",
  "themeAliases": {
    "color": "color",
    "radius": "radius",
    "spacing": "1px"
  }
}`,
    link: 'config',
  },
  {
    file: 'globals.css',
    code: `@import 'tailwindcss';
@import './styles/tailwind/theme.css';`,
  },
  {
    file: 'page.tsx',
    code: `<button className='bg-primary rounded-12 px-16 py-8'>
  Save
</button>`,
    link: 'themes',
  },
];
