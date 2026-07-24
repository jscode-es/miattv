'use client';

import { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { defaultLocale, isLocale, localeCookieName, type Locale } from '@i18n/routing';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Cambia el idioma sin tocar la URL: escribe la preferencia en cookie
 * (whitelist `locales`) y refresca los Server Components para que
 * `src/i18n/request.ts` la recoja en la siguiente petición.
 */
export function useLocaleSwitcher() {
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) return;
      document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
      startTransition(() => {
        router.refresh();
      });
    },
    [locale, router],
  );

  return { locale, setLocale, isPending };
}
