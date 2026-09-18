'use client';

import { initClientI18n } from '@/i18n';
import { useState } from 'react';
import { I18nextProvider } from 'react-i18next';

// Инстанс создаётся синхронно на первом рендере: ресурсы уже в пропсах, поэтому
// i18next инициализируется без ожидания и сервер отдаёт готовый HTML (SSR).
// Раньше init был в useEffect с `return null` до его завершения — на сервере
// эффект не выполняется, и всё тело документа уходило клиенту пустым.
const TranslationsProvider = ({
  children,
  locale,
  resources,
}: {
  children: React.ReactNode;
  locale: string;
  resources: Record<string, unknown>;
}) => {
  const [i18n] = useState(() =>
    initClientI18n(locale, resources as Record<string, Record<string, unknown>>)
  );

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
