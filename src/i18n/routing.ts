export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Nombre de la cookie que guarda la preferencia de idioma del usuario.
 * No hay routing por locale (la URL nunca cambia), así que la cookie es la
 * única fuente de verdad tanto en el servidor (`i18n/request.ts`) como en el
 * cliente (`useLocaleSwitcher`).
 */
export const localeCookieName = 'NEXT_LOCALE';

export function isLocale(value: string | undefined | null): value is Locale {
  if (!value) return false;
  return (locales as readonly string[]).includes(value);
}
