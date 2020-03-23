const cacheName = 'cache-v1'
const cacheAssets = [
	'/',
	'/offline',
	'/public/bundled.css',
	'/media/fonts.nasalization-rg.woff',
	'/media/images/exit_icon.svg',
	'/media/images/favicon.ico',
	'/media/images/nasa_logo.png',
	'/media/images/white_arrow.svg'
]

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
		.then(res => { //Network succesful
			const resClone = res.clone() //Clone the response
			caches
				.open(cacheName)
				.then(cache => cache.put(e.request, resClone))
			return res
		})
		//If network failed: check if request is in cache => serve cached version || if not in cache => serve '/offline'
		.catch(err => {
			return caches.match(e.request).then(res => {
				if (res === undefined) {
					return caches.match('/offline').then(response => response)
				} else {
					return caches.match(e.request).then(response => response)
				}
			})
		})
	)
})