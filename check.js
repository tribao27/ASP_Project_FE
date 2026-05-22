import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'test@test.com');
  await page.fill('input[type="password"]', '123456');
  await page.click('button:has-text("Đăng nhập hệ thống")');
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:3000/ai');
  await page.waitForTimeout(1000);
  const header = await page.locator('header').count();
  console.log('Header count:', header);
  if (header === 0) console.log('HEADER IS MISSING');
  await browser.close();
})();
