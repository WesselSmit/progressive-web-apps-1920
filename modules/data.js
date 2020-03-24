module.exports = (data, month) => {
	data = deleteRedundantProps(data)
	data = filterDataMedia_types(data)
	data = copyrightGoodDefault(data)
	data = IDgenerator(data, month)
	return data
}

function deleteRedundantProps(data) {
	const necessaryProperties = ['date', 'url', 'title', 'explanation', 'copyright', 'media_type']
	data.map(item => {
		Object.keys(item).map(prop => {
			if (!necessaryProperties.includes(prop)) {
				delete item[prop]
			}
		})
		//Replace JPG src's with webp src's (only use this if the images are prefetched, stored & converted to webp format)
		item.url = item.url.split('/')
		item.url = '../../images/' + item.url[item.url.length - 1].replace('jpg', 'webp')
	})
	return data
}

function filterDataMedia_types(data) {
	return data.filter(item => item.media_type === 'image')
}


function copyrightGoodDefault(data) {
	data.map(item => item.copyright = (item.copyright === undefined) ? "public_domain" : item.copyright)
	return data
}


function IDgenerator(data, month) {
	let index = 0

	data.map(item => {
		item.id = month + "/" + index
		index++
	})
	return data
}