const cacheName = 'v1'
const cacheAssets = [
	'/',
	'/public/bundled.css'
]

self.addEventListener('install', e => {
	console.log("serviceWorker installed!")

	e.waitUntil(
		caches.open(cacheName) //Cache files
		.then(cache => {
			console.log('caching files!')
			cache.addAll(cacheAssets)
		})
		.then(() => self.skipWaiting()) //Use newer serviceWorker versions if they're available in the 'waiting state'
	)
})

self.addEventListener('activate', e => {
	console.log("serviceWorker activated!")

	e.waitUntil(
		clients.claim() //Sync serviceWorkers across all active clients
		.then(() => caches.keys() //Remove outdated caches
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cache => {
						console.log('clearing old caches!')
						if (cache !== cacheName) {
							return caches.delete(cache)
						}
					})
				)
			})
		))
})

self.addEventListener('fetch', e => {
	console.log('serviceWorker fetching!')

	e.respondWith(
		fetch(e.request).catch(() => caches.match(e.request))
	)
})