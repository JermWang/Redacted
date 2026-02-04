/**
 * Capture screenshots - simple scroll-based approach
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const URL = 'http://localhost:3000';
const OUT = path.join(__dirname, '../public/screenshots');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1920, height: 1080 } });
  const page = await browser.newPage();
  
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  
  // 1. Top of page (hero)
  await page.screenshot({ path: path.join(OUT, '01-hero.png') });
  console.log('1. Hero ✓');
  
  // 2. Scroll down a bit
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, '02-mid.png') });
  console.log('2. Mid section ✓');
  
  // 3. Scroll more
  await page.evaluate(() => window.scrollTo(0, 800));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, '03-feed.png') });
  console.log('3. Feed section ✓');
  
  // 4. Bottom
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, '04-bottom.png') });
  console.log('4. Bottom ✓');
  
  await browser.close();
  console.log('Done!');
})();
