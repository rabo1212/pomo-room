'use client';

import { useCallback, useEffect, useState } from 'react';

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const notify = useCallback((title: string, body: string, tag?: string) => {
    if (permission !== 'granted') return;

    // 백그라운드 탭일 때만 알림 (포그라운드에서는 토스트로 대체)
    if (document.hidden) {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        tag: tag || 'pomo-room',
      } as NotificationOptions);
    }
  }, [permission]);

  return { permission, requestPermission, notify };
}
