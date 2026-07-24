import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isLocale, localeCookieName } from './routing';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`./local/${locale}.json`)).default,
  };
});
