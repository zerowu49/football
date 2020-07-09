const CACHE_NAME = "football-score";
var urlsToCache = [
  // file native
  "/",
  "/about.html",
  "/index.html",
  "/manifest.json",
  "/nav.html",
  "/package-lock.json",
  "/package.json",
  "/push.js",
  "/service-worker.js",

  "/img/192.png",
  "/img/512.png",
  "/img/notification.png",
  "/img/favicon.ico",
  "/css/style.css",
  "/js/api.js",
  "/js/db.js",
  "/js/idb.js",
  "/js/nav.js",
  "/js/script.js",
  "/pages/favourite.html",
  "/pages/home.html",

  // link url
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.js",

  // moment
  "/node_modules/moment/moment.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  const base_url = "https://api.football-data.org/v2/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request,{ignoreSearch: true}).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

//  --- PUSH NOTIF --- 
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  if (!event.action) {
    // Penguna menyentuh area notifikasi diluar action
    console.log('Notification Click.');
    return;
  }
  switch (event.action) {
    case 'yes-action':
      console.log('Pengguna memilih action yes.');
      break;
    case 'no-action':
      console.log('Pengguna memilih action no');
      break;
    default:
      console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
      break;
  }
  // Saat pengguna memilih salah satu action, maka event.action akan memiliki nilai sesuai dengan isi properti action yang berada di dalam array actions. 
  // Apabila sentuhan pengguna berada di luar notifikasi, maka properti event.action akan bernilai undefined. 
  // Oleh karena itu kita bisa memeriksa jika pengguna menyentuh notifikasi diluar action melalui blok kode:
  if (!event.action) {
      // Penguna menyentuh area notifikasi diluar action
      console.log('Notification Click.');
      return;
  }
});


self.addEventListener('push', function(event) {
	console.log("Push listener")
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    icon: '/img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});