import { ThemeType } from '@/utils/get-theme';

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

/**
 * Устанавливает куку темы на клиенте (для ThemeSwitch).
 */
export function setThemeCookie(theme: ThemeType): void {
  if (typeof document === 'undefined') return;
  document.cookie = `THEME=${theme};path=/;max-age=${COOKIE_MAX_AGE}`;
}
