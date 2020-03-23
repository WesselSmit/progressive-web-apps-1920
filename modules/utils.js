const storage = require('#modules/storage.js')

const timeReference = storage.getStoredData('./storage/timeReference.json')

module.exports = utils = {
	checkDates: data => {
		const lastDataDate = data[data.length - 1].date
		const date = utils.createYYYYMMDDobj()
		const currentDate = utils.joinString('-', date.currentYear, utils.prefixZero(date.currentMonth), utils.prefixZero(date.currentDay))
		return utils.compareValues(lastDataDate, currentDate)
	},
	createYYYYMMDDobj: () => {
		const now = new Date()
		return {
			currentDay: now.getDate(),
			currentMonth: now.getMonth() + 1,
			currentYear: now.getFullYear()
		}
	},
	joinString: (joinChar, ...strings) => {
		return strings.join(joinChar)
	},
	prefixZero: (item) => {
		item = item.toString()
		return (item.length < 2) ? `0${item}` : item
	},
	compareValues: (base, value) => value === base,
	isMonthCurrentMonth: clickedMonth => {
		const currentMonth = new Date().getMonth()
		return (utils.findMonthObjByName(clickedMonth).index === currentMonth)
	},
	findMonthObjByName: monthName => timeReference.months.find(month => month.name === monthName),
	findMonthObjByIndex: monthIndex => timeReference.months[monthIndex],
	monthsOfTheYear: () => {
		const now = new Date()
		const monthIndex = now.getMonth() + 1
		let currentMonths = []
		for (let i = 0; i < monthIndex; i++) {
			currentMonths.push(timeReference.months[i].name)
		}
		return currentMonths
	},
	createStartYearDate: () => {
		const year = new Date().getFullYear()
		return utils.joinString('-', year, '01', '01')
	}
}