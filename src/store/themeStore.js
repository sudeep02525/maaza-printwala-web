import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  } catch (e) {
    return 'system';
  }
};

const getPrefersDark = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
};

const getEffectiveDark = (theme) => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return getPrefersDark();
};

let mediaListenerAttached = false;

export const useThemeStore = create((set, get) => ({
  theme: 'system',
  resolvedTheme: 'light',
  isDark: false,
  isMounted: false,

  initTheme: () => {
    if (typeof window === 'undefined') return;

    const storedTheme = getInitialTheme();
    const effectiveDark = getEffectiveDark(storedTheme);

    document.documentElement.classList.toggle('dark', effectiveDark);

    set({
      theme: storedTheme,
      resolvedTheme: effectiveDark ? 'dark' : 'light',
      isDark: effectiveDark,
      isMounted: true,
    });

    if (!mediaListenerAttached) {
      mediaListenerAttached = true;
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleMediaChange = (e) => {
        if (get().theme === 'system') {
          const isSystemDark = Boolean(e.matches);
          document.documentElement.classList.toggle('dark', isSystemDark);
          set({
            resolvedTheme: isSystemDark ? 'dark' : 'light',
            isDark: isSystemDark,
          });
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleMediaChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleMediaChange);
      }
    }
  },

  setTheme: (newTheme) => {
    if (!['light', 'dark', 'system'].includes(newTheme)) return;

    const effectiveDark = getEffectiveDark(newTheme);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', newTheme);
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {}

      document.documentElement.classList.toggle('dark', effectiveDark);
    }

    set({
      theme: newTheme,
      resolvedTheme: effectiveDark ? 'dark' : 'light',
      isDark: effectiveDark,
    });
  },
}));
