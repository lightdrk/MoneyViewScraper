const puppeteer = require('puppeteer');



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
        let login_buttton = await page.waitForSelector('#login-signup-btn',{visible:true});
        await login_buttton.click();
		await page.waitForSelector('#id_login');
		const email = await page.$('#id_login');
		if (email){
			
			await email.type('pemoyej714@vreaa.com');
			
			const password = await page.$('#id_password');

			await password.type('pemoyej714@vreaa.com');

			await page.click('button[class ="btn btn-sm btn-block tl-btn-blue p-x-2 pull-right login-btn"]');
		}
	}
    await page.waitForSelector('input.navbar-topsearch.form-inline.form-control.mform-control.navbar-ac.tl-navbar-search-input.tl-navbar-search.ui-autocomplete-input');
    var ad = await page.$('button.close');
    if (ad){
        await ad.click();
    }
    let search_input = await page.$('input.navbar-topsearch.form-inline.form-control.mform-control.navbar-ac.tl-navbar-search-input.tl-navbar-search.ui-autocomplete-input');
    let stock =  'mohit';
    await page.waitForSelector('.ui-menu-item');
    await search_input.type(stock);
    await page.evaluate(async()=>{
        var list = document.getElementsByClassName('ui-menu-item');
        await document.getElementById(list[0].firstChild.id).click();
    })

    
})();
