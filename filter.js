const fs = require('fs');

let x = fs.readFileSync('./stock.txt','utf-8');

x = x.split('\n');

for (let n of x){
	n = n.split('\t');
	for (let xn of n){
		if (!(xn /2)){
			console.log(xn);
		}
	}
}
			

