const utils = require('#modules/utils.js')

module.exports = (req, res) => {
	const monthIndex = new Date().getMonth()
	const month = utils.findMonthObjByIndex(monthIndex).name

	res.redirect(`/month/${month}`)
}