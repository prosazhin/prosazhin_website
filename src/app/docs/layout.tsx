import { docsSource } from '@/lib/docs-source';
import { getLocale } from '@/utils/get-locale';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { CSSProperties, ReactNode } from 'react';

import { docsI18n } from '@/lib/docs-source';

const docsUI = defineI18nUI(docsI18n, {
  ru: {
    displayName: 'Русский',
    'On this page(table of contents)': 'На этой странице',
    'No Headings(table of contents)': 'Нет заголовков',
    'Search(search trigger)': 'Поиск',
    'Search(search dialog)': 'Поиск',
    'Open Search(search trigger)(aria-label)': 'Открыть поиск',
    'Close Search(search dialog)(aria-label)': 'Закрыть поиск',
    'No results found(search dialog)': 'Ничего не найдено',
    'Open Sidebar(sidebar)(aria-label)': 'Открыть меню документации',
    'Close Sidebar(sidebar)(aria-label)': 'Закрыть меню документации',
    'Collapse Sidebar(sidebar)(aria-label)': 'Свернуть меню',
    'Show Sidebar(sidebar)': 'Показать меню',
    'Hide Sidebar(sidebar)': 'Скрыть меню',
    'Copy Text(code block)(aria-label)': 'Скопировать код',
    'Copied Text(code block)(aria-label)': 'Код скопирован',
    'Copy Anchor Link(heading anchor)(aria-label)': 'Скопировать ссылку на раздел',
    'Table of Contents(inline table of contents)': 'Содержание',
  },
  en: { displayName: 'English' },
});

export default async function DocsRootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <RootProvider
      theme={{ enabled: false }}
      i18n={docsUI.provider(locale)}
    >
      <div className='docs-shell'>
        <DocsLayout
          tree={docsSource.getPageTree(locale)}
          nav={{ enabled: false, title: locale === 'ru' ? 'Разделы' : 'Sections', url: '/docs' }}
          i18n={false}
          themeSwitch={{ enabled: false }}
          sidebar={{ prefetch: false }}
          containerProps={{
            style: {
              '--fd-docs-row-1': '72px',
              '--fd-docs-height': '100dvh',
            } as CSSProperties,
          }}
        >
          {children}
        </DocsLayout>
      </div>
    </RootProvider>
  );
}
