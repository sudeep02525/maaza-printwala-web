'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore.js';

export function useTheme() {
  const { theme, resolvedTheme, isDark, isMounted, setTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return {
    theme,
    resolvedTheme,
    isDark,
    isMounted,
    setTheme,
  };
}
