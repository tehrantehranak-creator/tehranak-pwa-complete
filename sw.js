// Tehranak PWA Service Worker - Complete Version
const CACHE_NAME = 'tehranak-complete-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app.js',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Tehranak Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Tehranak Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Tehranak Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Tehranak Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Tehranak Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Tehranak Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Tehranak Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Tehranak Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('Tehranak Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            
            // Return a simple offline response for other requests
            return new Response('Offline - Tehranak PWA', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Tehranak Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'tehranak-background-sync') {
    event.waitUntil(
      // Perform background sync tasks
      console.log('Tehranak Service Worker: Performing background sync'),
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'BACKGROUND_SYNC',
            data: { action: 'sync-data' }
          });
        });
      })
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Tehranak Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'اعلان جدید از تهرانک',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    dir: 'rtl',
    lang: 'fa',
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'مشاهده',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'بستن',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('تهرانک - سامانه املاک', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Tehranak Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Tehranak Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    // Cache specific URLs
    const urls = event.data.urls;
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urls);
      })
      .catch((error) => {
        console.error('Error caching URLs:', error);
      });
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(CACHE_NAME).then(cache => {
      return cache.keys();
    }).then(keys => {
      event.ports[0].postMessage({ cacheSize: keys.length });
    });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Tehranak Service Worker: Error occurred:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Tehranak Service Worker: Unhandled promise rejection:', event.reason);
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Tehranak Service Worker: Periodic sync triggered', event.tag);
  
  if (event.tag === 'tehranak-periodic-sync') {
    event.waitUntil(
      // Perform periodic sync tasks
      console.log('Tehranak Service Worker: Performing periodic sync')
    );
  }
});