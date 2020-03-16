module.exports = (req, res) => {
	const previousPageURL = req.header('Referer')
	const previousMonth = previousPageURL.split("/apod/")[1].split("/")[0]
	res.redirect(`/month/${previousMonth}`)
}