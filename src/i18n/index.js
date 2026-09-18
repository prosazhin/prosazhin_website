import { initReactI18next } from 'react-i18next/initReactI18next';

import { createInstance } from 'i18next';

import enCareer from '@/i18n/locales/en/career.json';
import enCommon from '@/i18n/locales/en/common.json';
import enMatrix from '@/i18n/locales/en/matrix.json';
import enPages from '@/i18n/locales/en/pages.json';
import enPrivacy from '@/i18n/locales/en/privacy.json';
import enProjects from '@/i18n/locales/en/projects.json';
import enSkills from '@/i18n/locales/en/skills.json';
import ruCareer from '@/i18n/locales/ru/career.json';
import ruCommon from '@/i18n/locales/ru/common.json';
import ruMatrix from '@/i18n/locales/ru/matrix.json';
import ruPages from '@/i18n/locales/ru/pages.json';
import ruPrivacy from '@/i18n/locales/ru/privacy.json';
import ruProjects from '@/i18n/locales/ru/projects.json';
import ruSkills from '@/i18n/locales/ru/skills.json';

export const i18nConfig = {
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
};

const NAMESPACES = ['common', 'pages', 'projects', 'career', 'skills', 'matrix', 'privacy'];

// Обычные (не через import()) импорты: под Turbopack в dev-режиме динамический
// import() локализаций не отслеживается файловым вотчером как обычная
// зависимость, и хот-релоад не подхватывает правки текста переводов —
// приходится перезапускать сервер. Файлы локализаций маленькие, поэтому
// собираем их в бандл целиком вместо ленивой асинхронной загрузки.
const NAMESPACE_RESOURCES = {
  ru: {
    common: ruCommon,
    pages: ruPages,
    projects: ruProjects,
    career: ruCareer,
    skills: ruSkills,
    matrix: ruMatrix,
    privacy: ruPrivacy,
  },
  en: {
    common: enCommon,
    pages: enPages,
    projects: enProjects,
    career: enCareer,
    skills: enSkills,
    matrix: enMatrix,
    privacy: enPrivacy,
  },
};

/**
 * Создаёт экземпляр i18n с уже загруженными resources синхронно (`initImmediate: false`):
 * ресурсы лежат в памяти, бэкенда нет, поэтому init завершается до возврата из функции.
 * Сервер и клиент получают одинаковые resources → вывод совпадает, гидрация без ошибок.
 */
export function initClientI18n(locale, resources) {
  const i18n = createInstance();
  i18n.use(initReactI18next);

  i18n.init({
    lng: locale,
    resources: resources || {},
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: 'common',
    fallbackNS: 'common',
    ns: NAMESPACES,
    initImmediate: false,
    react: { useSuspense: false },
  });

  return i18n;
}

export const initTranslations = async (locale, i18nInstance, resources) => {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  await i18nInstance.init({
    lng: locale,
    resources: resources || NAMESPACE_RESOURCES,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: 'common',
    fallbackNS: 'common',
    ns: NAMESPACES,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
};
