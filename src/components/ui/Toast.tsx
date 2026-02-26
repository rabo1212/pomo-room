'use client';

import { create } from 'zustand';
import { useEffect, useState } from 'react';

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message) => set({ message }),
  clear: () => set({ message: null }),
}));

export function showToast(message: string) {
  useToastStore.getState().show(message);
}

export default function Toast() {
  const message = useToastStore((s) => s.message);
  const clear = useToastStore((s) => s.clear);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!message) return;
    setExiting(false);

    const exitTimer = setTimeout(() => setExiting(true), 1800);
    const clearTimer = setTimeout(() => clear(), 2100);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(clearTimer);
    };
  }, [message, clear]);

  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
      <div className={`clay px-5 py-2.5 text-sm font-semibold text-lavender-dark shadow-lg ${
        exiting ? 'toast-exit' : 'toast-enter'
      }`}>
        {message}
      </div>
    </div>
  );
}
