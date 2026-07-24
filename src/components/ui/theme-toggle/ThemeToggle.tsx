'use client';

import { useTheme } from '@hook/use-theme';
import type { Theme } from '@provider/theme-provider';

import styles from './ThemeToggle.module.css';

const LABEL: Record<Theme, string> = {
  light: 'Modo claro',
  dark: 'Modo oscuro',
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    // El tema resuelto (localStorage/preferencia de sistema) solo se conoce
    // en cliente; el texto puede diferir del render inicial del servidor a
    // propósito — evita el flash de contenido en vez de forzar un segundo
    // render tras montar.
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
      suppressHydrationWarning
    >
      {LABEL[theme]}
    </button>
  );
}
