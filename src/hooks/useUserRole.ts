'use client';

import { useState, useCallback } from 'react';

export type UserRole = 'visitor' | 'staff' | 'curator';

const STORAGE_KEY = 'cafepulse_user_role';
const CURATOR_PIN = 'cafepulse2026';
const STAFF_PIN = 'staffsolo2026';

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window === 'undefined') return 'visitor';
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
      if (saved === 'curator' || saved === 'staff' || saved === 'visitor') {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'visitor';
  });

  const loginWithPin = useCallback((pin: string): UserRole | null => {
    const clean = pin.trim();
    if (clean === CURATOR_PIN) {
      setRole('curator');
      try {
        localStorage.setItem(STORAGE_KEY, 'curator');
      } catch {
        // ignore storage errors
      }
      return 'curator';
    }
    if (clean === STAFF_PIN) {
      setRole('staff');
      try {
        localStorage.setItem(STORAGE_KEY, 'staff');
      } catch {
        // ignore storage errors
      }
      return 'staff';
    }
    return null;
  }, []);

  const loginAsCurator = useCallback(
    (pin: string): boolean => {
      return loginWithPin(pin) !== null;
    },
    [loginWithPin]
  );

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
    isCurator: role === 'curator' || role === 'staff',
    isStaff: role === 'staff',
    isDeveloper: role === 'curator',
    loginWithPin,
    loginAsCurator,
    logoutToVisitor,
  };
}

