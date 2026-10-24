'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'cafepulse_favorite_ids';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('cafepulse_bookmarks_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('cafepulse_bookmarks_changed', callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || '[]';
  } catch {
    return '[]';
  }
}

function getServerSnapshot(): string {
  return '[]';
}

export function useBookmarks() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  let bookmarkedIds: number[] = [];
  try {
    bookmarkedIds = JSON.parse(raw);
  } catch {
    bookmarkedIds = [];
  }

  const toggleBookmark = (id: number) => {
    try {
      const current: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('cafepulse_bookmarks_changed'));
    } catch {
      // Ignore
    }
  };

  const isBookmarked = (id: number) => bookmarkedIds.includes(id);

  return {
    bookmarkedIds,
    toggleBookmark,
    isBookmarked,
    totalBookmarks: bookmarkedIds.length,
  };
}
