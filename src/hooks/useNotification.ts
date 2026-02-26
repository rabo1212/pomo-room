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

  const notify = useCallback((title: string, body: string) => {
    if (permission !== 'granted') return;
    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  }, [permission]);

  return { permission, requestPermission, notify };
}
