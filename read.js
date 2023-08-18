const fs = require('fs');

function read(){
	let list = fs.readFileSync('./stock.txt','utf-8');
	return list.split('\n');
}


module.exports = read;
