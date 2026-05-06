const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log('Navigating...');
  await page.goto('https://notebooklm.google.com/notebook/6a28877a-e0dd-4b44-8437-554ddd021cce/preview', { waitUntil: 'networkidle2' });
  
  console.log('Extracting text...');
  const text = await page.evaluate(() => document.body.innerText);
  console.log('Result:');
  console.log(text.substring(0, 1000));
  
  await browser.close();
})();
