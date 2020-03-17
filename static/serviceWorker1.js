const cacheName = 'cache-v1'

self.addEventListener('install', e => {
	self.skipWaiting() //Use newer version in waiting state if available
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

self.addEventListener('fetch', e => {
	e.respondWith(
		fetch(e.request)
		//If a network connection is available => use fetched data || if not => use the cached version
		.then(res => {
			const resClone = res.clone() //Clone response
			caches
				.open(cacheName)
				.then(cache => cache.put(e.request, resClone))
			return res
		})
		.catch(err => caches.match(e.request).then(res => res))
	)
})