import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

/**
 * Server Component: `NextIntlClientProvider` recibe locale/mensajes de forma
 * automática del request config (`src/i18n/request.ts`) cuando se renderiza
 * dentro del árbol de Server Components, sin necesidad de pasarlos a mano.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
