const filterButtons = document.querySelectorAll('#filters label')
filterButtons.forEach(filterButton => filterButton.addEventListener('click', e => filter(e.target)))

function filter(node) {
	const filter = node.getAttribute('for')
	const cards = document.querySelectorAll('[href*="apod"]')

	cards.forEach(card => card.classList.remove('filtered'))


	const non_copyright = document.querySelectorAll('[copyright="public_domain"]')
	const copyright = document.querySelectorAll('[copyright]:not([copyright="public_domain"])')

	if (filter === 'public_domain') {
		copyright.forEach(card => card.classList.add('filtered'))
	} else if (filter === 'copyright') {
		non_copyright.forEach(card => card.classList.add('filtered'))
	} else {
		cards.forEach(card => card.classList.remove('filtered'))
	}
}