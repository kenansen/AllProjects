const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://mail.google.com');

  // Tarayıcıda manuel olarak giriş yap
  console.log('>>> Giriş yap, bittikten sonra Enter\'a bas <<<');
  await new Promise(resolve => process.stdin.once('data', resolve));

  // Oturumu kaydet
  await context.storageState({ path: 'auth.json' });
  console.log('Oturum kaydedildi!');
  await browser.close();
})();