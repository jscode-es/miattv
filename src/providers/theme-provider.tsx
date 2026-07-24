'use client';

import { createContext, useCallback, useSyncExternalStore, type ReactNode } from 'react';

import { THEME_STORAGE_KEY } from '@theme/constants';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

// El servidor no puede conocer el tema persistido (localStorage); este
// valor debe coincidir con el `:root` por defecto de `theme.css` (claro)
// para que el HTML servido sea determinista.
function getServerSnapshot(): Theme {
  return 'light';
}

/**
 * `data-theme` lo muta tanto el script inline `beforeInteractive` de
 * `app/layout.tsx` (antes de hidratar) como `applyTheme` (al hacer toggle) —
 * en ambos casos es una mutación externa al ciclo de render de React, así
 * que `useSyncExternalStore` (no `useState`) es el punto de sincronización
 * correcto: evita el lint `react-hooks/set-state-in-effect` (nada de
 * `setState` síncrono en un efecto) y, a diferencia de un `useState` con
 * inicializador perezoso, garantiza una re-sincronización real justo tras
 * hidratar cuando el tema persistido difiere de `getServerSnapshot`.
 *
 * Con el `useState` anterior, ese mismatch quedaba silenciado por
 * `suppressHydrationWarning` sin corregirse: `aria-pressed` y el texto del
 * toggle se congelaban en el valor servido por el servidor hasta el primer
 * click (hallazgo reportado por `qa` en la iteración anterior). Reproducido
 * y verificado el fix con un harness de hidratación
 * (`react-dom/server` + `react-dom/client` sobre jsdom) simulando justo ese
 * escenario: preferencia oscura persistida + revisita de la página.
 */
function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(getSnapshot() === 'dark' ? 'light' : 'dark');
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
