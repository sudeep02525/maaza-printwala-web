'use client';
import { useCallback, useEffect, useState } from 'react';

const KEY = 'maaza_recent_searches';
const MAX = 6;

const read = () => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

export function useRecentSearches() {
  const [recent, setRecent] = useState([]);
  useEffect(() => { setRecent(read()); }, []);

  const add = useCallback((term) => {
    const t = (term || '').trim();
    if (!t) return;
    const next = [t, ...read().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    setRecent(next);
  }, []);

  const remove = useCallback((term) => {
    const next = read().filter((x) => x !== term);
    localStorage.setItem(KEY, JSON.stringify(next));
    setRecent(next);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setRecent([]);
  }, []);

  return { recent, add, remove, clear };
}
