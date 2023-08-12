const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');


(async() =>{
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: false,
		userDataDir: './tmp'
	});
	const page = await browser.newPage();
	await page.goto('https://www.moneyworks4me.com/login/?from=menu',{
		waitUntil: 'load'
	});
	let current_url = await page.url();
	if (current_url == 'https://www.moneyworks4me.com/login/?from=menu'){
		await page.waitForSelector('#emailid');
		const email = await page.$('#emailid');
		if (email){
			
			await email.type('rahapan428@mliok.com');
			
			const password = await page.$('#password');

			await password.type('rahapan428@mliok.com');

			await page.click('button[class ="btn-block py-2 font-12rem text-white sign-up border-0"]');
		}
	}
	// pop_search box
	try{	
		await page.waitForSelector('#stocksearch-icon',{timeout:5000})
		await page.click('#stocksearch-icon');
	}catch (error){
		console.log(error);
		await page.click('#header-search-box');
	}
	await page.waitForSelector('input#popupsearch');
	let search_input = await page.$("input#popupsearch");
	var stock = 'Mohit';
	await search_input.type(stock);
	
	var stock_name = "";
	var href = null;
	// this evaluates to href ,else null
	href = await page.evaluate(async (stock)=>{
		let arr = await document.getElementsByClassName('list-group-item text-left');
		console.log(arr);
		for (let inside of arr){
			if((inside.innerText).toLowerCase() == stock.toLowerCase()){
				stock_name = inside.innerText
				return inside.firstChild.href;
			}
		}
		return null;
	},stock)
	console.log(href);
	// href 
	if (href !== null){
		// selection through href
		var href_click = await page.waitForSelector(`a[href="${href}"]`,{visible: true});
		if (!href_click){
			// selection through stock_name
			href_click = await page.waitForXPath(`//a[contains(text(),"${stock_name}")]`, {visible: true});
		}
		await href_click.click();
		await page.waitForNavigation();

	}else{
		// alternative is directly searches the stock and nav through their

		let quote_search = await page.waitForSelector('button#quote_search');
		console.log(await quote_search.isVisible());
		await page.evaluate(()=>{
			let js = document.getElementById('quote_search');
			js.click()
		});

		await page.waitForSelector('#full-search-list');
		
		let match = await page.evaluate(async (stock)=>{
			
			let str = document.getElementById('full-search-list');
			for ( let name of str.innerText.split('\n')){
				if (stock.toLowerCase().includes(name.toLowerCase())){
					stock_name = name;
					return str.innerHTML;
				}
			}
			//string here.
			stock_name = stock;
			return str.innerHTML
		},stock)
		for (let li of match.split('<hr>')){
			console.log('li:',li);
			console.log(stock_name);
			//checks for stock name presence
			if ((li.toLowerCase()).includes(stock_name.toLowerCase())){
				href = li.slice(li.indexOf('/'),li.lastIndexOf('"'));
				console.log(href);
				var href_click = await page.waitForSelector(`a[href="${href}"]`,{visible: true});

				if (!(href_click)){
					console.log(href);
					href_click = await page.waitForXPath(`//a[contains(text(),"${stock_name}")]`, {visible: true});
				}
				await href_click.click();
				console.log('...............')
				
			}
		}
		if (!(href)){
			console.log('no found');
		}
				
	}

	// //search button
	
	// await search.click();
	// await page.waitForNavigation();
	// //produce list of object 
	// let rating_card = await page.$('.card-body text-center');
	// console.log(rating_card.innerText);
	// if (rating_card){
	// 	for (let value of values){
	// 		//we can get data like 
	// 		console.log(value.innerText);
	// }
	// }

    
})();
