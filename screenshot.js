const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewport({ width: 1440, height: 900 });

  try {
    console.log('Navigating to localhost:3000/en...');
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle0', timeout: 30000 });
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'homepage-preview.png', fullPage: true });
    console.log('Screenshot saved to homepage-preview.png');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await browser.close();
  }
})();
