const puppeteer = require('puppeteer');
const progress = require('cli-progress');
const math = require('math')
const fs = require('fs');

const email = '';
const password = '';
const file = 'STonk.txt';
const bar1 = new progress.SingleBar({},progress.Presets.shades_classic);
var stockList= (fs.readFileSync(file,'utf-8')).split('\n');
bar1.start(stockList.length,0);
(async() =>{
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: false,
        userDataDir: './trend'
	});
	const page = await browser.newPage();
	await page.goto('https://trendlyne.com/features/',{
        waitUntil: 'domcontentloaded'
	});
	let current_url = await page.url();
	if (current_url == 'https://trendlyne.com/features/'){
        	let login_button ;
		try{
			login_button = await page.waitForSelector('#login-signup-btn',{visible:true, timeout: 10000});
		}catch(error){console.log(error);}
		if (login_button){
		
        		await login_button.click();
			await page.waitForSelector('#id_login');
			const email = await page.$('#id_login');
			if (email){
				
				await email.type(email);
				
				const password = await page.$('#id_password');
	
				await password.type(password);
	
				await page.click('button[class ="btn btn-sm btn-block tl-btn-blue p-x-2 pull-right login-btn"]');
			}
		}
	}
	await page.waitForSelector('input.navbar-topsearch.form-inline.form-control.mform-control.navbar-ac.tl-navbar-search-input.tl-navbar-search.ui-autocomplete-input');
    	var ad = await page.$('button.close');
    	if (ad){
    	    await ad.click();
    	}

	
	var skip = true
	let x =1 ;
	for (let stock of stockList){
		x++;
		bar1.update(x);

		if (stock == ''){
			bar1.stop();
			break;	
		}
		let search_input = await page.$('input.navbar-topsearch.form-inline.form-control.mform-control.navbar-ac.tl-navbar-search-input.tl-navbar-search.ui-autocomplete-input');
		await page.evaluate(()=>{
			document.querySelector('input[class="navbar-topsearch form-inline form-control mform-control navbar-ac tl-navbar-search-input tl-navbar-search ui-autocomplete-input"]').value = '';
		});
		await search_input.type(stock);
		try{
			await page.waitForSelector('.ui-menu-item',{timeout: 10000});
		}catch(error){
			//console.log(error);
		}
		
		await page.evaluate((skip)=>{
			var list = document.getElementsByClassName('ui-menu-item');
			console.log(document.getElementsByClassName('ui-autocomplete-category')[0].innerText);
			if (document.getElementsByClassName('ui-autocomplete-category')[0].innerText.toLowerCase().includes('no matches found')){
			 	skip = false;
			}
			console.log(skip);
			if(skip){
				document.getElementById(list[0].firstChild.id).click();
			}
		},skip);
		if (skip){
			try{
				await page.waitForNavigation({timeout:5000});
			}catch(error){
				//console.log(error);
			}
			var dataExtract = await page.evaluate(()=>{
				let data = document.getElementsByClassName('dvm-v2-block');
				let list=[];
				for (let text of data){
					let l = text.innerText.split('\n');
					console.log(l);
					list.push(l);
				}
				console.log(list);
				return list;

			})||false;
			let stockName;
			let csv=`\n\n-,${stock},-`;
			for (let firstN=0;firstN<3;firstN++){
				csv=csv+'\n';
				for (let N=0;N<3;N++){
					
					csv =csv+dataExtract[N][firstN]+',';
				}	
			}
			fs.appendFile('data.csv',csv,'utf-8',()=>{});
		
		}
	}
    	bar1.stop();
	await browser.close();
})();
