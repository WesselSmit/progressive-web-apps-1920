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
		// .catch(err => caches.match(e.request).then(res => res))
		.catch(err => {
			//If network failed: check if request is in cache => serve cached version || if not in cache => serve '/offline'
			console.log('het gaat niet goed => de offline page moet geserved worden')
			const a = await caches.match(e.request)
			console.log(a)
			return caches.match('/offline')
		})
	)
})