'use client';

import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useDarkMode() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  // 초기화: localStorage에서 읽기
  useEffect(() => {
    const saved = localStorage.getItem('pomo-theme') as Theme | null;
    const t = saved || 'system';
    setThemeState(t);
    applyTheme(t);
  }, []);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  function applyTheme(t: Theme) {
    const dark =
      t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    setIsDark(dark);
  }

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem('pomo-theme', t);
    applyTheme(t);
  }, []);

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
  }, [isDark, setTheme]);

  return { theme, isDark, setTheme, toggle };
}
