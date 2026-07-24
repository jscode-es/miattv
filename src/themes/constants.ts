/*
 * Módulo plano (SIN 'use client'): única fuente de verdad de
 * `THEME_STORAGE_KEY`, consumida tanto por `theme-provider.tsx` (Client
 * Component) como por `app/layout.tsx` (Server Component) para el script
 * anti-FOUC. Al no llevar la directiva de cliente, Next.js puede
 * interpolarla en el script inline `beforeInteractive` sin sustituirla por
 * una referencia de cliente inválida.
 */
export const THEME_STORAGE_KEY = 'miattv-theme';
