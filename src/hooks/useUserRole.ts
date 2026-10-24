'use client';

import { useState, useCallback } from 'react';

export type UserRole = 'visitor' | 'curator';

const STORAGE_KEY = 'cafepulse_user_role';
const CURATOR_PIN = 'cafepulse2026';

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window === 'undefined') return 'visitor';
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
      if (saved === 'curator' || saved === 'visitor') {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'visitor';
  });

  const loginAsCurator = useCallback((pin: string): boolean => {
    if (pin.trim() === CURATOR_PIN) {
      setRole('curator');
      try {
        localStorage.setItem(STORAGE_KEY, 'curator');
      } catch {
        // ignore storage errors
      }
      return true;
    }
    return false;
  }, []);

  const logoutToVisitor = useCallback(() => {
    setRole('visitor');
    try {
      localStorage.setItem(STORAGE_KEY, 'visitor');
    } catch {
      // ignore storage errors
    }
  }, []);

  return {
    role,
    isCurator: role === 'curator',
    loginAsCurator,
    logoutToVisitor,
  };
}
