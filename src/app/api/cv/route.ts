import { i18nConfig } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import { isProfession } from '@/utils/resume';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get('role');
  const profession = isProfession(role) ? role : 'developer';
  const lang = url.searchParams.get('lang');
  const locale = lang && i18nConfig.locales.includes(lang) ? lang : await getLocale();
  const destination = `/resume/cv-${locale}-${profession}.pdf`;

  return new Response(null, {
    status: 307,
    headers: {
      Location: destination,
      'Cache-Control': 'private, no-store',
    },
  });
}
