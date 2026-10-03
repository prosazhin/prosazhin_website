import { i18nConfig } from '@/i18n';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

const isLocale = (value?: string | null): value is string =>
  !!value && i18nConfig.locales.includes(value);

const setLocale = (response: NextResponse, locale: string) => {
  response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: COOKIE_MAX_AGE });
  return response;
};

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Явный выбор языка в ссылке (?lang=en): без редиректа, чтобы краулеры превью (без куки)
  // сразу получали нужный язык и метаданные. Язык передаём заголовком для getLocale(),
  // а куку ставим для последующих переходов.
  const queryLocale = searchParams.get('lang');

  if (isLocale(queryLocale)) {
    const headers = new Headers(request.headers);
    headers.set(i18nConfig.localeHeader, queryLocale);
    return setLocale(NextResponse.next({ request: { headers } }), queryLocale);
  }

  const locale = request.cookies.get('NEXT_LOCALE')?.value;

  if (isLocale(locale) || pathname !== '/') {
    return NextResponse.next();
  }

  return setLocale(NextResponse.next(), i18nConfig.defaultLocale);
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
