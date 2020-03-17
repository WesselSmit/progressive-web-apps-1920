const cacheName = 'dynamic'

self.addEventListener('install', e => {
	console.log("serviceWorker installed!")

	self.skipWaiting()
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
		fetch(e.request)
		.then(res => {
			const resClone = res.clone()
			caches
				.open(cacheName)
				.then(cache => cache.put(e.request, resClone))
			return res
		})
		.catch(err => caches.match(e.request).then(res => res))
	)
})