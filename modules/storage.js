const fs = require('fs');

module.exports = storage = {
	checkIfFileExists: () => (fs.existsSync('./storage/data.json')) ? true : false,
	getStoredData: () => fs.readFileSync('./storage/data.json', {
		encoding: 'utf8'
	}),
	saveJSON: data => {
		fs.writeFileSync('./storage/data.json', JSON.stringify(data))
		return data
	}
}