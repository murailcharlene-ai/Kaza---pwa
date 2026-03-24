const CACHE_NAME = 'kazae-v3';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (e.request.url.includes('.png') || e.request.url.includes('fonts')) {
          caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => caches.match('/index.html'));
    })
  );
});

// ── Rappel quotidien ──
let dailyTimer = null;

function scheduleDailyNotif(hour, minute, body) {
  if (dailyTimer) clearTimeout(dailyTimer);
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target - now;
  dailyTimer = setTimeout(() => {
    self.registration.showNotification('🏠 Kazaé — Rappel du jour', {
      body: body || 'Tu as des tâches à faire aujourd\'hui !',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'kazae-daily',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: '/' }
    });
    // Reprogrammer pour le lendemain
    scheduleDailyNotif(hour, minute, body);
  }, delay);
}

self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'SCHEDULE_DAILY') {
    const { hour, minute, body } = e.data;
    scheduleDailyNotif(hour || 8, minute || 0, body);
  }
  if (e.data.type === 'CANCEL_NOTIF') {
    if (dailyTimer) { clearTimeout(dailyTimer); dailyTimer = null; }
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});
