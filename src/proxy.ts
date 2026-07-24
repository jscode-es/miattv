import { NextResponse, type NextRequest } from 'next/server';

import { defaultLocale, isLocale, localeCookieName, type Locale } from '@i18n/routing';

/**
 * Negocia el locale a partir de `Accept-Language` cuando la request no trae
 * todavía la cookie de preferencia. Solo hay 2 locales soportados, así que un
 * parser propio evita añadir una dependencia nueva solo para esto.
 */
function pickLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;

  const preferences = header
    .split(',')
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(';');
      const qParam = params.find((param) => param.trim().startsWith('q='));
      const quality = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { tag: rawTag.trim().toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .sort((a, b) => b.quality - a.quality);

  const prefersSpanish = preferences.some((preference) => preference.quality > 0 && preference.tag.startsWith('es'));

  return prefersSpanish ? 'es' : defaultLocale;
}

export function proxy(request: NextRequest): NextResponse {
  const existingLocale = request.cookies.get(localeCookieName)?.value;
  if (isLocale(existingLocale)) {
    return NextResponse.next();
  }

  const locale = pickLocaleFromAcceptLanguage(request.headers.get('accept-language'));

  // Se fija también en el request para que el request config de `next-intl`
  // (que solo puede leer cookies del propio request) vea el locale negociado
  // en esta misma petición, sin esperar a la siguiente.
  request.cookies.set(localeCookieName, locale);

  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(localeCookieName, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
