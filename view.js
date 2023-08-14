const puppeteer = require('puppeteer');


(async()=>{
  const browser = await puppeteer.launch({headless: false, defaultViewport: false,userDataDir: './tmp' });
  const page = await browser.newPage();
  await page.goto('https://in.tradingview.com/',{
    waitUntil: 'load'
  });

  const logged = await page.evaluate(async()=>{
      let sign_button = document.getElementsByClassName('tv-header__area tv-header__area--user');
      //check here
      if (sign_button[0].children){
        sign_button[0].children[0].click();
        return true;
      }
    return false;
  });

  if(logged){
    const [popup] = await Promise.all([
      new Promise(resolve => page.once('popup',resolve)),
      page.click('span[class="label-mDJVFqQ3 label-jFqVJoPk label-mDJVFqQ3 label-YQGjel_5 js-main-menu-dropdown-link-title"]'),
      setTimeout(async()=>{
        await page.evaluate(async()=>{
          var google = document.getElementsByClassName('ellipsis-container-bYDQcOkp');
          for (let a of google){
            console.log(a.innerText);
            if(a.innerText == 'Google'){
              console.log('!!!!!!!!clicked!!!!!!!!!!'); 
              a.click();
            }
          }
        });
      },2000)
    ]);
  
    await page.waitForSelector('input[name="identifier"]');
    await page.type('input[name="identifier"]','***');
    const next = await page.evaluate(()=>{
      var next_button = document.getElementsByClassName('VfPpkd-vQzf8d');
      for (let next of next_button){
        if (next.innerText == 'Next'){
          next.click();
          return true;
        }
      }
      return false;
    });
    if (next){
      await page.waitForSelector('input[name="Passwd"]');
      //password here for google
      await page.type('input[name="Passwd"]','***');
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
      setTimeout(5000);
  }

  await page.evaluate(async()=>{
    var search_box = document.getElementsByClassName('tv-header-search-container tv-header-search-container__button tv-header-search-container__button--full js-header-search-button');
    search_box[0].click();
  });
  await page.type('input[name="query"]',"sobha");
  await page.evaluate(async ()=>{
    document.getElementsByClassName('searchButton-KLRTYDjH button-KLRTYDjH iconedButton-KLRTYDjH hoveredButton-KLRTYDjH')[0].click();
  });
  const user_url = await page.url();
  console.log(user_url);
  //url edit 

})();
