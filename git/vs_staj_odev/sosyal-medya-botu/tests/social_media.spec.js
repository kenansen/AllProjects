require('dotenv').config();
const { test, expect } = require('@playwright/test');

test('Discord Mesaj Otomasyon Testi', async ({ page }) => {
  test.setTimeout(300000);

  const humanDelay = (min = 800, max = 2000) =>
    page.waitForTimeout(min + Math.random() * (max - min));

  const humanType = async (locator, text) => {
    await locator.click();
    for (const char of text) {
      await locator.type(char, { delay: 80 + Math.random() * 120 });
    }
  };

  // 1. ADIM: Giriş
  console.log('--- 1. ADIM: Discord Girişi ---');
  await page.goto('https://discord.com/', { waitUntil: 'networkidle' });
  await humanDelay(2000, 3000);

  // Ana sayfadaki Log In butonuna tıkla
  await page.getByRole('link', { name: 'Log In' }).click();
  await humanDelay(2000, 3000);

  // Email ve şifreyi .env dosyasından oku
  const emailInput = page.getByRole('textbox', { name: 'Email or Phone Number' });
  await emailInput.waitFor({ state: 'visible' });

  await humanType(emailInput, process.env.DISCORD_EMAIL);
  //await humanType(emailInput, 'd.yuksel404@gmail.com');
  await humanDelay(500, 1000);



  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await humanType(passwordInput, process.env.DISCORD_PASSWORD);
  //await humanType(passwordInput, 'd.yuksel404');
  await humanDelay(500, 1000);

  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/channels/**', { timeout: 30000 });
  console.log('Giriş başarılı!');
  await humanDelay(3000, 4000);

  
  // 2. ADIM: Önce tadic sohbetini sil (temiz başlamak için)
  console.log('--- 2. ADIM: Eski Sohbet Siliniyor ---');
  
  //await page.goto('https://discord.com/channels/@me', { waitUntil: 'networkidle' });//playwright olması lzmdı**
  await humanDelay(2000, 3000);

  // Eğer tadic listede varsa sil
  const tadicLink = page.getByRole('link', { name: '! tadic (direct message)' });
  if (await tadicLink.isVisible({ timeout: 3000 })) {
    await tadicLink.click({ button: 'right' });
    await humanDelay(500, 1000);
    await page.getByRole('menuitem', { name: 'Close DM' }).click();
    await humanDelay(1000, 2000);
    console.log('Eski sohbet silindi.');
  } else {
    console.log('Zaten listede yok, devam ediliyor.');
  }

  // 3. ADIM: Şimdi DM sayısını say (tadic olmadan)
  console.log('--- 3. ADIM: Inbox Analiz Ediliyor ---');
  const dmLocator = page.locator('[data-list-item-id^="private-channels-"]');
  const ilkSayi = await dmLocator.count();
  console.log('Başlangıçtaki DM sayısı: ' + ilkSayi);

  // 4. ADIM: Yeni mesaj gönder
  console.log('--- 4. ADIM: Yeni Mesaj Gönderiliyor ---');

  // "Find or start a conversation" butonuna tıkla
  await page.getByRole('button', { name: 'Find or start a conversation' }).click();
  await humanDelay(1000, 2000);

  // Arama kutusuna tadic yaz
  const aramaKutusu = page.getByRole('combobox', { name: 'Quick Switcher' });
  await aramaKutusu.waitFor({ state: 'visible' });
  await humanType(aramaKutusu, 'tadic');
  await humanDelay(1500, 2500);

  // Çıkan sonuçtan tadic'i seç
  await page.getByText('! tadictadicinvekili').click();
  await humanDelay(1500, 2500);

  // Mesaj kutusunu bul ve yaz
  const messageBox = page.locator('[data-slate-editor="true"]');
  await messageBox.waitFor({ state: 'visible' });

  const mesaj = 'Playwright Test Mesajı #' + Math.floor(Math.random() * 1000);
  await humanType(messageBox, mesaj);
  await humanDelay(500, 1000);
  await page.keyboard.press('Enter');
  console.log('Mesaj gönderildi: ' + mesaj);

  // 5. ADIM: Doğrulama
  console.log('--- 5. ADIM: Doğrulama Yapılıyor ---');
  
  await humanDelay(2000, 3000);

  //await page.goto('https://discord.com/channels/@me', { waitUntil: 'networkidle' });//tıklanacaktı**
  await humanDelay(2000, 3000);

  const sonSayi = await dmLocator.count();
  console.log('Son DM sayısı: ' + sonSayi);

  
//playwright hepsini çalıştırıyor dosy adı belitr**
//iki modda da çaalışıyor olması lazım
/*
  if (sonSayi > ilkSayi) {       
    console.log('SONUÇ: Başarılı! Yeni sohbet oluşturuldu.');
  } else {
    console.log('SONUÇ: Var olan sohbete mesaj gönderildi.');
  }
    */

  // Yeni sohbet oluşturulduysa
expect(sonSayi).toBeGreaterThan(ilkSayi);

// Var olan sohbete mesaj gönderildiyse
expect(sonSayi).toBe(ilkSayi);







  // 6. ADIM: Mesaj içeriği doğrula
  console.log('--- 6. ADIM: Mesaj İçeriği Doğrulanıyor ---');

  await page.getByRole('link', { name: '! tadic (direct message)' }).click();
  await humanDelay(1500, 2500);

  const sonMesajlar = page.locator('li[class*="messageListItem"]');
  const sonMesaj = sonMesajlar.last();
  await sonMesaj.waitFor({ state: 'visible', timeout: 10000 });
  const icerik = await sonMesaj.textContent();

  
  //expect ile kontrol edildi **
  expect(icerik).toContain('Playwright Test Mesajı');
  console.log('İçerik doğrulandı: Mesaj görünüyor.');
  


  // 7. ADIM: Sohbeti kapat (sonraki test için temizle)
  console.log('--- 7. ADIM: Sohbet Kapatılıyor ---');
  
 // await page.goto('https://discord.com/channels/@me', { waitUntil: 'networkidle' });//tıklanacak**
  await humanDelay(2000, 3000);

  await page.getByRole('link', { name: '! tadic (direct message)' }).click({ button: 'right' });
  await humanDelay(500, 1000);
  await page.getByRole('menuitem', { name: 'Close DM' }).click();
  await humanDelay(1000, 2000);
  console.log('Sohbet kapatıldı, sonraki test temiz başlayacak.');

});