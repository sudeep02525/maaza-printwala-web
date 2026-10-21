'use client';
import { useCallback, useEffect, useState } from 'react';
import { safeJsonParse, isBlank } from '@/lib/devkit';

const KEY = 'maaza_recent_searches';
const MAX = 6;

const read = () => {
  if (typeof window === 'undefined') return [];
  const res = safeJsonParse(localStorage.getItem(KEY));
  return res.success && Array.isArray(res.data) ? res.data : [];
};

export function useRecentSearches() {
  const [recent, setRecent] = useState([]);
  useEffect(() => { setRecent(read()); }, []);

  const add = useCallback((term) => {
    if (isBlank(term)) return;
    const t = term.trim();
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
