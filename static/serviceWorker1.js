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
	const event = e
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
		// .catch(err => { //Network fails
		// 	caches.match(e.request).then(matching => {
		// 		// console.log(matching, event.request, caches.match(event.request))

		// 		// if (matching) {
		// 		// 	return caches.match(event.request)
		// 		// } else {
		// 		// 	caches.match('/offline')
		// 		// }
		// 		console.log(caches.match(event.request) || caches.match('/offline'))
		// 		return matching || caches.match('/offline')
		// 	})
		// })

		// .catch(err => caches.match(e.request))
		//todo: If network failed: check if request is in cache => serve cached version || if not in cache => serve '/offline' (this all happens in the catch())
		.catch(err => caches.match('/offline')) //Network fails
	)
})


// return cache.match(request).then(function (matching) {
// 	return matching || Promise.reject('no-match');
//   });