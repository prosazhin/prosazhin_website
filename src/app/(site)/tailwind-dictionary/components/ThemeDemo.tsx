'use client';

import CodeBlock from '@/components/CodeBlock';
import { Badge, Button, InlineRadio, InlineRadioGroup } from '@prosazhin/pbcomponents';
import { useState } from 'react';

type ThemeType = 'light' | 'dark';

const THEMES: ThemeType[] = ['light', 'dark'];

// Живой пример тем: data-theme на контейнере переключает семантические токены pbstyles,
// которые сгенерированы tailwind-dictionary. Классы внутри блока не меняются.
const ThemeDemo = ({
  labels,
}: {
  labels: {
    label: string;
    light: string;
    dark: string;
    badge: string;
    title: string;
    text: string;
    primary: string;
    secondary: string;
  };
}) => {
  const [theme, setTheme] = useState<ThemeType>('dark');

  const code = `<section data-theme="${theme}">
  <div className='bg-basic-0 rounded-16'>
    <h3 className='text-basic-400'>…</h3>
    <Button color='primary'>…</Button>
  </div>
</section>`;

  return (
    <div className='flex w-full flex-col gap-y-16'>
      <InlineRadioGroup
        size='s'
        value={theme}
        onChange={(value) => setTheme(value as ThemeType)}
        aria-label={labels.label}
      >
        {THEMES.map((item) => (
          <InlineRadio
            key={item}
            value={item}
          >
            {labels[item]}
          </InlineRadio>
        ))}
      </InlineRadioGroup>
      {/* На телефоне превью идёт сразу под переключателем, код — ниже */}
      <div className='lg-min:grid-cols-2 grid w-full grid-cols-1 gap-16'>
        <div
          data-theme={theme}
          className='rounded-16 border-secondary-200 bg-basic-0 desktop:p-32 flex flex-col justify-center gap-y-20 border p-24'
        >
          <div className='flex flex-col items-start gap-y-12'>
            <Badge
              size='s'
              color='primary'
              theme='light'
            >
              {labels.badge}
            </Badge>
            <h3 className='text-tm20 text-basic-400'>{labels.title}</h3>
            <p className='text-t16 text-basic-300'>{labels.text}</p>
          </div>
          {/* Кнопки-образцы: показывают цвета темы, но ничего не делают — убраны из фокуса */}
          <div
            aria-hidden='true'
            className='flex flex-row flex-wrap gap-8'
          >
            <Button
              size='m'
              color='primary'
              theme='filled'
              tabIndex={-1}
              className='max-xs:w-auto!'
            >
              {labels.primary}
            </Button>
            <Button
              size='m'
              color='secondary'
              theme='border'
              tabIndex={-1}
              className='max-xs:w-auto!'
            >
              {labels.secondary}
            </Button>
          </div>
        </div>
        <CodeBlock
          file='page.tsx'
          code={code}
          wrap={false}
        />
      </div>
    </div>
  );
};

export default ThemeDemo;
