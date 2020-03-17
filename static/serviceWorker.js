const cacheName = 'cache-v1'
const cacheAssets = ['/', '/offline', '/public/bundled.css']

self.addEventListener('install', e => {
	e.waitUntil(caches.open(cacheName)
		.then(cache => cache.addAll(cacheAssets))
		.then(() => self.skipWaiting())
	)
})

self.addEventListener('activate', e => {
	e.waitUntil(
		clients.claim() //Sync serviceWorkers across all active clients
		.then(() => caches.keys() //Remove outdated caches
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cache => {
						if (cache !== cacheName) {
							return caches.delete(cache)
						}
					})
				)
			})
		))
})



// Poging wessel
self.addEventListener('fetch', e => {
	// const event = e
	e.respondWith(
		fetch(e.request)
		//If a network connection is available => use fetched data || if not => use the cached version
		.then(res => { //Network succesful
			const resClone = res.clone() //Clone the response
			caches
				.open(cacheName)
				.then(cache => cache.put(e.request, resClone))
			return res
		})
		//todo: If network failed: check if request is in cache => serve cached version || if not in cache => serve '/offline' (this all happens in the catch())
		//Network fails
		// .catch(err => caches.match('/offline')) //serve offline-page
		// .catch(err => caches.match(e.request)) //serve cached-detail-page
		//todo: de 2 bovenstaande `.catch()` statements moeten samengevoegd worden
	)
})



//poging met maikel
// .catch(err => {
// 	console.log('er is een error')
// 	caches.match(e.request).then(res => {
// 		if (res) {
// 			return res
// 		} else {
// 			return caches.match('/offline')
// 		}
// // return caches.match(e.request) || caches.match('/offline')
// 	})



// Poging Maikel
// self.addEventListener('fetch', e => {
// 	e.respondWith(
// 		caches.match(e.request)
// 		.then(cachedRes => {
// 			if (cachedRes) {
// 				console.log("SW serving from cache:", cachedRes)
// 				return cachedRes
// 			}
// 			return fetch(e.request)
// 				.then((fetchRes) => fetchRes)
// 				.catch((err) => {
// 					console.log(e.request, e.request.header)
// 					const isHTMLPage = e.request.method == 'GET' && e.request.header.get('accept').includes('text/html')
// 					if (isHTMLPage) {
// 						return caches.match('/offline')
// 					}
// 				})
// 		})
// 	)
// })