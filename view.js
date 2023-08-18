const puppeteer = require('puppeteer');
const keypress = require('keypress');
const {exec} = require('child_process');
const prompt = require('prompt-sync')();



keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();


(async()=>{
  const browser = await puppeteer.launch({headless: false, defaultViewport: false,userDataDir: './tmp' });
  var page = await browser.newPage();
  await page.goto('https://in.tradingview.com/',{
    waitUntil: 'load'
  });
  //await page.waitForSelector('button[class="tv-header__area tv-header__area--user"]');
  const logged = await page.evaluate(async()=>{
      let sign_button = document.getElementsByClassName('tv-header__area tv-header__area--user');
      let check = document.getElementsByTagName('h1');
      if (check.length > 0){
      	if (check[0].innerText.includes('/')){
        	sign_button[0].children[0].click();
       		return true;
     	}
      }
      return false;
  });
  setTimeout(()=>{console.log('waiting....to check if loged in or not');},5000);
// checks if user is logged in or not .
  console.log(logged);
  if(logged){
    const [popup] = await Promise.all([
      new Promise(resolve => page.once('popup',resolve)),
      page.click('span[class="label-mDJVFqQ3 label-jFqVJoPk label-mDJVFqQ3 label-YQGjel_5 js-main-menu-dropdown-link-title"]'),
      setTimeout(async()=>{
        await page.evaluate(async()=>{
          var google = document.getElementsByClassName('ellipsis-container-bYDQcOkp');
          for (let a of google){
            if(a.innerText == 'Google'){
              a.click();
            }
          }
        });
      },2000)
    ]);
// checks for the new tabs if it is google authentication switches to that tab
    setTimeout(()=>{console.log('waititng for google..');},2000);
    let pages = await browser.pages();
    page = pages.find((page) => page.url().includes('https://accounts.google.com/'));
    if (page){
	await page.bringToFront();
    	await page.waitForSelector('input[id="identifierId"]');
    	await page.type('input[id="identifierId"]','developer.mohitawat@gmail.com');
    	const next = await page.evaluate(()=>{
      	var next_button = document.getElementsByClassName('VfPpkd-vQzf8d');
     	 for (let nxt of next_button){
        	if (nxt.innerText == 'Next'){
         	 nxt.click();
          	 return true;
       	 	}
      	 }
      	 return false;
    	});
	await page.waitForNavigation();
//    here password is typed in for the login. in google
        if (next){
      		await page.waitForSelector('input[name="Passwd"]');
      		await page.type('input[name="Passwd"]','Developer.Mohitrawat@gmail.com');
      		const logged = await page.evaluate(()=>{
        		var next_button = document.getElementsByClassName('VfPpkd-vQzf8d');
        		for (let next of next_button){
          			if (next.innerText == 'Next'){
            				next.click();
            				return true;
         			 }
        		}
        		return false;
      		});
    	}
   }
  }
//   below code switches the tab, and searches for a stock .
  setTimeout(async ()=>{console.log('tradingview switching.......')},5000);
  let pages;
  pages = await browser.pages();
  page = pages.find((page) => page.url().includes('https://in.tradingview.com'));
  await page.bringToFront();
  await page.evaluate(async()=>{
  var search_box = document.getElementsByClassName('tv-header-search-container tv-header-search-container__button tv-header-search-container__button--full js-header-search-button');
  search_box[0].click();
  });
  await page.waitForSelector('input[name="query"]');
  await page.type('input[name="query"]',"sobha");
  await page.evaluate(async ()=>{
  document.getElementsByClassName('searchButton-KLRTYDjH button-KLRTYDjH iconedButton-KLRTYDjH hoveredButton-KLRTYDjH')[0].click();
  });
  await page.waitForNavigation();
  let url = await page.url();
  console.log('page__url: -',url);
  var search_url = url.slice(0,url.indexOf('=')+1);
 // let tabs = await browser.pages()l
  let stock_list = ['sobha','mohitind','m_m','tatamotors','reliance','hdfcbank'];
  let move = 0;
  let add = 0;
  let input;
  process.stdin.on('keypress',async (ch,key)=>{
	  pages = await browser.pages();
	  await console.log(await pages[1].title());
	  if(key && key.name === 'right'){
		  move++; 
		  if (pages.length <= move){
			  move = 0;
		  }
		  await pages[move].bringToFront();
	  }else if(key && key.name === 'left'){
		  move--;
		  if(move < 0){
			  move = pages.length - 1;
		  }
		  await pages[move].bringToFront();
		  //tab move to left
	  }else if(key && key.name === 'up'){
		  add ++;
		  if (add >= stock_list.length){
			  console.log('nothing to add..');
			  add = stock_list.length;
		 }else{
			 page = await browser.newPage();
			 await page.goto(search_url+stock_list[add]);
		 } 
		 if (pages.length > 10){
			 await pages[0].close();
		 }		 
		  //add new tabs and remvoe same number of tab
	  }else if (key && key.ctrl && key.name === 'o'){
		  let name_of_stock = prompt('>');
		  if (name_of_stock.includes(',')){
			 var name_list = name_of_stock.split(',');
			 for (let name_in of name_list){
				 page = await browser.newPage();
				 await page.goto(search_url+name_in);
			 }
		 }else{
			 page = await browser.newPage();
			 await page.goto(search_url+name_of_stock);
	 	 }
	  }else if (key && key.ctrl && key.name === 's'){
		  input = prompt('> ');
		  var page_title={};
		  for(let page of pages){
		 	 let key;
			 let urlofpage = await page.url();
			 if (urlofpage.includes('symbol=')){
				 key = urlofpage.slice(urlofpage.lastIndexOf('=')+1).toLowerCase();
			 }else{
				 key = (await page.title())+'title';
			 }
			 page_title[key] = page;

			 }
		  try{
			 await page_title[input].bringToFront();
		  }catch(err){
			console.log(`no page with name ${input}`);
		  }
  	  }else if(key && key.ctrl && key.name === 'c'){
		  process.exit();
	  }

	  exec('xdotool search --name "github/1" windowactivate');
  });	
  process.stdin.resume();
  
  

})();
