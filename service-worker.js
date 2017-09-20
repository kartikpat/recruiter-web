//importScripts('serviceworker-cache-polyfill.js');

var log = console.log.bind(console);//bind our console to a variable
var version = "0.0.3";
var cacheName = "sw-demo";
var cache = cacheName + "-" + version;
var req = new Request ({"redirect" : "follow", "authenticated" : "true"});
// var filesToCache = [
//                     "/static/build/css/index.min.css",
//                     '/static/build/js/index.min.js',
//                     '/views/index.html',
//                     "/"
//                  ];

// log(filesToCache);


//Add event listener for install
self.addEventListener("install", function(event) {
    log('[ServiceWorker] Installing....');
    //service-worker will be in installing state till event.waitUntil completes
    event.waitUntil(caches
                        .open(cache)//open this cache from caches and it will return a Promise
                        .then(function(cache) { //catch that promise
                            log('[ServiceWorker] Caching files', version);
                            cache.addAll([req]);
                        })
                    );
});

self.addEventListener('fetch', function(event) {
  // Calling event.respondWith means we're in charge
  // of providing the response. We pass in a promise
  // that resolves with a response object

  log(event.request.url);
    if (event.request.method != "GET" || event.request.mode == "cors" || event.request.url.startsWith('chrome-extension')){
        event.respondWith(fetch(event.request));
        return;
    }
    else {
        event.respondWith(
    // First we look for something in the caches that
    // matches the request

        caches.match(event.request).then(function(response) {
            log(event.request);
            log(response);
          // If we get something, we return it, otherwise
          // it's null, and we'll pass the request to
          // fetch, which will use the network.
          return response || fetch(event.request);
        })
  );
  }
});

self.addEventListener('activate', function(event) {
  log('[ServiceWorker] Activate');
  event.waitUntil(
                    caches.keys()//it will return all the keys in the cache as an array
                    .then(function(keyList) {
                            //run everything in parallel using Promise.all()
                            Promise.all(keyList.map(function(key) {
                                    if (key !== cache) {
                                        log('[ServiceWorker] Removing old cache ', key);
                                        //if key doesn`t matches with present key
                                        return caches.delete(key);
                                    }
                                })
                            );
                        })
                );
});
