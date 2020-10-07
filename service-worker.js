const preCacheName = "pre-cache-pra",
  // llistats d'arxius estatics per a afegir a la cache (css, scripts, imatges,....)
  preCacheFiles = [
    "/",
    "/index.html",
    "html/content_home.html",
    "html/content_hotels.html",
    "html/content_detail.html",
    "css/main.css",
    "js/main.js",
    "js/search.js",
    "js/hotels.js",
    "js/datepicker.js",
    "js/app.js",
    "logos/uocair_logo.png",
    "/favicon.ico",
    "imatges/carregant.gif",
    "imatges/destacada.png",
    "imatges/inspirate/aventura.png",
    "imatges/inspirate/disney.png",
    "imatges/inspirate/paris.png",
    "imatges/inspirate/playas.png",
    "imatges/top-destinos/berlin.png",
    "imatges/top-destinos/budapest.png",
    "imatges/top-destinos/japon.png",
    "imatges/top-destinos/ny.png",
    "imatges/top-destinos/reykjavik.png",
    "imatges/top-destinos/sidney.png",
    "https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  ];

self.addEventListener("install", event => {
  console.log("installing precached files");
  caches.open(preCacheName).then(function (cache) {
    return cache.addAll(preCacheFiles);
  })
});

self.addEventListener("activate", event => {
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (!response) {
        //fall back to the network fetch
        return fetch(event.request);
      }
      return response;
    })
  )
});

