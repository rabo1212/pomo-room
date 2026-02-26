'use client';

import { useCallback, useEffect, useRef } from 'react';
import { playStartSound, playCompleteSound, playBreakSound, playCoinSound } from '@/lib/sounds';

function getSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('pomo-sound') !== 'off';
}

export function useSound() {
  const enabledRef = useRef(getSoundEnabled());

  // localStorage 변경 감지 (설정 모달에서 토글 시)
  useEffect(() => {
    const handler = (e: Event) => {
      enabledRef.current = (e as CustomEvent).detail;
    };
    window.addEventListener('pomo-sound-toggle', handler);
    return () => window.removeEventListener('pomo-sound-toggle', handler);
  }, []);

  const playStart = useCallback(() => {
    if (enabledRef.current) playStartSound();
  }, []);

  const playComplete = useCallback(() => {
    if (enabledRef.current) playCompleteSound();
  }, []);

  const playBreak = useCallback(() => {
    if (enabledRef.current) playBreakSound();
  }, []);

  const playCoin = useCallback(() => {
    if (enabledRef.current) playCoinSound();
  }, []);

  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    localStorage.setItem('pomo-sound', enabledRef.current ? 'on' : 'off');
    return enabledRef.current;
  }, []);

  return { playStart, playComplete, playBreak, playCoin, toggleSound };
}
