import { i18nConfig } from '@/i18n';
import { cookies, headers } from 'next/headers';

export async function getLocale(): Promise<string> {
  const [headerStore, cookieStore] = await Promise.all([headers(), cookies()]);
  const locale = headerStore.get(i18nConfig.localeHeader) ?? cookieStore.get('NEXT_LOCALE')?.value;
  return locale && i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
}
