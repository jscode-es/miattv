'use client';

import { useTranslations } from 'next-intl';

import { useLocaleSwitcher } from '@hook/useLocaleSwitcher';
import { locales } from '@i18n/routing';

import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const { locale, setLocale, isPending } = useLocaleSwitcher();

  return (
    <div className={styles.group} role="group" aria-label={t('groupLabel')}>
      {locales.map((value) => (
        <button
          key={value}
          type="button"
          className={styles.option}
          aria-pressed={value === locale}
          aria-current={value === locale ? 'true' : undefined}
          disabled={isPending}
          onClick={() => setLocale(value)}
        >
          {t(value)}
        </button>
      ))}
    </div>
  );
}
