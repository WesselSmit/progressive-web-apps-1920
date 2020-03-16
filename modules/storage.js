const fs = require('fs');

module.exports = storage = {
	checkIfFileExists: path => (fs.existsSync(path)) ? true : false,
	getStoredData: path => JSON.parse(fs.readFileSync(path, {
		encoding: 'utf8'
	})),
	saveJSON: (data, path) => {
		fs.writeFileSync(path, JSON.stringify(data))
		return data
	}
}