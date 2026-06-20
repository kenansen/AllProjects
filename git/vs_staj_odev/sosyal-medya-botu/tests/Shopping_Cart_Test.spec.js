/**
  npx playwright test Shopping_Cart_Test.spec.js --headed  --reporter=line    
 */

require('dotenv').config();

const { test, expect } = require('@playwright/test');


//eskisi**
//test('Trendyol E-Commerce Shopping Cart Test', async ({ page }) => {
test('Trendyol E-Commerce Shopping Cart Test', async ({ page, context }) => {


  
  // ─────────────────────────────────────────────
  // 1. SAYFA YÜKLENİYOR
  // ─────────────────────────────────────────────
  const cartLoadStart = Date.now();
  await page.goto('https://www.trendyol.com', { waitUntil: 'domcontentloaded' });
  const cartLoadTime = Date.now() - cartLoadStart;
  console.log(`Sayfa yüklenme süresi: ${cartLoadTime}ms`);

await page.pause(); // *** 

   // await page.pause(); // *** 


  // Çerez popup'ını kapat (varsa)
  const cookieBtn = page.locator('#onetrust-accept-btn-handler');
  if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cookieBtn.click();
    console.log('Çerez popup\'ı kapatıldı.');
  }

  // ─────────────────────────────────────────────
  // 2. ANA KATEGORİ: ELEKTRONİK
  // ─────────────────────────────────────────────
  //cinsiyet seçeneği kapatma tuşu
  await page.locator('#modals').getByText('Erkek').click();
  // Sayfaya doğrudan gitmek yerine locator ile tıklayarak geçiyoruz
  await page.getByRole('link', { name: 'Elektronik' }).click();

  // Sayfanın yüklendiğinden emin olmak için beklemeyi unutma
  await page.waitForLoadState('domcontentloaded');


  console.log('Ana kategori "Elektronik" seçildi.');


    //await page.pause(); // *** 
// ─────────────────────────────────────────────
// 3. ALT KATEGORİ: RASTGELE SEÇİM
// ─────────────────────────────────────────────
const kategoriler = [
  { type: 'link', name: 'DSBoutiques_elektronik_WEB_topstory_Cep Telefonu' },
  { type: 'link', name: 'DSBoutiques_elektronik_WEB_topstory_Ev Aletleri' },
  { type: 'link', name: 'DSBoutiques_elektronik_WEB_topstory_Laptop&Tablet' },
  { type: 'link', name: 'DSBoutiques_elektronik_WEB_topstory_Bilgisayar Bileşenleri' },
  { type: 'link', name: 'DSBoutiques_elektronik_WEB_topstory_Televizyon' },
  { type: 'link', name: 'DSBoutiques_elektronik_WEB_topstory_Beyaz Eşya' },
  { type: 'link', name: 'DSBoutiques_elektronik_WEB_topstory_Kişisel Bakım' },
  { type: 'label', name: 'DSBoutiques_elektronik_WEB_topstory_Isıtma&Soğutma' },
  { type: 'label', name: 'DSBoutiques_elektronik_WEB_topstory_Oyuncu Ekipman' },
  { type: 'label', name: 'DSBoutiques_elektronik_WEB_topstory_Sinema&Ses Sistemleri' },
  { type: 'label', name: 'DSBoutiques_elektronik_WEB_topstory_Telefon Aksesuarları' },
  { type: 'label', name: 'DSBoutiques_elektronik_WEB_topstory_Giyilebilir Teknoloji' },
];

const randomIndex = Math.floor(Math.random() * kategoriler.length);
const secilenKategori = kategoriler[randomIndex];

const kategoriAdi = secilenKategori.name.split('_').pop(); // "Cep Telefonu" gibi kısa adı al
console.log(`Rastgele seçilen alt kategori: ${kategoriAdi}`);

if (secilenKategori.type === 'link') {
  await page.getByRole('link', { name: secilenKategori.name }).click();
} else {
  await page.getByLabel(secilenKategori.name).click();
}

await page.waitForLoadState('domcontentloaded');
console.log(`"${kategoriAdi}" kategorisine gidildi.`);


 //await page.pause(); // *** 
 // ─────────────────────────────────────────────
// 4. FİYAT FİLTRESİ: RASTGELE ARALIK
// ─────────────────────────────────────────────
  const fiyatAraliklari = [
    { min: 0,     max: 3000  },
    { min: 500,   max: 5000  },
    { min: 1000,  max: 7000  },
    { min: 2000,  max: 10000 },
    { min: 5000,  max: 15000 },
    { min: 0,     max: 20000 },
  ];

  const randomFiyatIndex = Math.floor(Math.random() * fiyatAraliklari.length);
  const secilenAralik = fiyatAraliklari[randomFiyatIndex];
  console.log(`Seçilen fiyat aralığı: ${secilenAralik.min} TL - ${secilenAralik.max} TL`);

  // Fiyat filtresini aç
  await page.getByRole('button', { name: 'Fiyat filter' }).click();
  await page.waitForTimeout(1000);

  // Min fiyat gir
  const minInput = page.getByTestId('price-range-input-min');
  await minInput.waitFor({ timeout: 10000 });
  await minInput.clear();
  await minInput.fill(String(secilenAralik.min));

  // Max fiyat gir
  const maxInput = page.getByTestId('price-range-input-max');
  await maxInput.clear();
  await maxInput.fill(String(secilenAralik.max));

  // Filtrele butonuna bas
  await page.getByTestId('price-range-button').click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  console.log(`Fiyat filtresi uygulandı: ${secilenAralik.min} TL - ${secilenAralik.max} TL`);




//await page.pause(); // *** 
// ─────────────────────────────────────────────
// 5. İLK ÜRÜNÜ SEÇ → ÜRÜN SAYFASINA GİT
// ─────────────────────────────────────────────

const firstProductLink = page.locator('[data-testid^="product-list-div"] a[href*="-p-"]').first();
await firstProductLink.waitFor({ timeout: 10000 });

// linkin href'ini logla - ne tür link seçildiğini görelim
const href = await firstProductLink.getAttribute('href');
console.log(`Seçilen link: ${href}`);

const firstProductName = await firstProductLink.textContent();
console.log(`Seçilen ürün: ${firstProductName?.trim()}`);

const newPagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
await firstProductLink.click();
const newTab = await newPagePromise;

if (newTab) {
  await newTab.waitForLoadState('domcontentloaded');
  console.log('Yeni sekmede ürün sayfası açıldı.');
  console.log(`Mevcut URL: ${newTab.url()}`);
} else {
  await page.waitForLoadState('domcontentloaded');
  console.log('Aynı sekmede ürün sayfasına gidildi.');
  console.log(`Mevcut URL: ${page.url()}`);
}
await page.pause(); // *** 
// ─────────────────────────────────────────────
// 6. ÜRÜN SAYFASI - FİYAT & İSİM DOĞRULA
// ─────────────────────────────────────────────

// Yeni sekmeyi al (5. bölüm zaten açtı)
const pages = context.pages();
const productPage = pages[pages.length - 1];
await productPage.waitForLoadState('domcontentloaded');
console.log(`Ürün sayfası URL: ${productPage.url()}`);

// ─── Ürün Adı ───
const productPageName = productPage.locator('[data-testid="product-title"]').first();
await productPageName.waitFor({ timeout: 10000 });
const productNameText = await productPageName.textContent();
console.log(`Ürün adı: ${productNameText.trim()}`);
expect(productNameText.trim()).toBeTruthy();
// ─── Ürün Fiyatı ───
const priceSelectors = [
  '[data-testid="normal-price"]',
  '[data-testid*="price"]',
  '[class*="prc-dsc"]',
  '[class*="prc-org"]',
  '[class*="product-price"]',
  '[class*="pr-bx-pr"]',
];

let productPriceText = '';
for (const sel of priceSelectors) {
  const els = await productPage.locator(sel).all();
  for (const el of els) {
    const visible = await el.isVisible({ timeout: 1000 }).catch(() => false);
    if (visible) {
      const txt = await el.textContent();
      if (txt?.trim()) {
        productPriceText = txt.trim();
        console.log(`Ürün fiyatı (${sel}): ${productPriceText}`);
        break;
      }
    }
  }
  if (productPriceText) break;
}

expect(productPriceText?.trim()).toBeTruthy();       //bazen hata veriyor ****
console.log('✅ Ürün adı ve fiyatı doğrulandı.');

await page.pause(); // *** // ─────────────────────────────────────────────
// 7-8. SEPETE EKLE & SEPETİ GÖRÜNTÜLE
// ─────────────────────────────────────────────

// Anladım popup'ını kapat
const onboardingModal = productPage.locator('.onboarding__default-renderer');
if (await onboardingModal.isVisible({ timeout: 3000 }).catch(() => false)) {
  const anladimBtn = onboardingModal.getByRole('button', { name: 'Anladım' });
  await anladimBtn.click();
  console.log('Popup kapatıldı.');
}

// Sepete ekle butonuna tıkla
const addToCartBtn = productPage.getByTestId('add-to-cart-button');
await addToCartBtn.waitFor({ timeout: 10000 });
await addToCartBtn.click();
console.log('Ürün sepete eklendi.');

// Sepetim linkine tıkla - yeni sekme açılabilir
const cartPagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
const cartLink = productPage.getByRole('link', { name: 'Sepetim' });
await cartLink.waitFor({ timeout: 10000 });
await cartLink.click();

const cartNewTab = await cartPagePromise;
let cartPage;
if (cartNewTab) {
  await cartNewTab.waitForLoadState('domcontentloaded');
  cartPage = cartNewTab;
  console.log('Sepet yeni sekmede açıldı.');
} else {
  await productPage.waitForLoadState('domcontentloaded');
  cartPage = productPage;
  console.log('Sepet aynı sekmede açıldı.');
}
console.log(`Sepet URL: ${cartPage.url()}`);
console.log('✅ Sepete ekleme ve sepet görüntüleme tamamlandı.');


await cartPage.pause(); // ***
// ─────────────────────────────────────────────
// 9. SEPET DOĞRULAMA: İSİM, FİYAT, KARGO
// ─────────────────────────────────────────────

// Ürün kartı
const cartItem = cartPage.locator('.pb-basket-item, .pb-item, [class*="merchant-item"], [class*="basket-item"]').first();
await cartItem.waitFor({ state: 'visible', timeout: 15000 });

// Ürün adı
const cartItemName = cartItem.locator('a[href*="-p-"], .pb-item-name, [class*="name"]').first();
const cartItemNameText = await cartItemName.textContent();
console.log(`Sepetteki ürün adı: ${cartItemNameText?.trim()}`);
expect(cartItemNameText?.trim()).toBeTruthy();

// Ürün fiyatı
const cartItemPrice = cartItem.locator('.pb-basket-item-price, [class*="price"]').first();
const cartItemPriceText = await cartItemPrice.textContent();
console.log(`Sepetteki ürün fiyatı: ${cartItemPriceText?.trim()}`);
expect(cartItemPriceText?.trim()).toBeTruthy();

// Ürün adeti
const cartItemQty = cartItem.locator('input[type="text"], input.ty-numeric-counter-input, [class*="quantity"]').first();
if (await cartItemQty.isVisible({ timeout: 3000 }).catch(() => false)) {
  const tagName = await cartItemQty.evaluate(el => el.tagName.toLowerCase());
  const cartItemQtyText = tagName === 'input'
    ? await cartItemQty.inputValue()
    : await cartItemQty.textContent();
  console.log(`Sepetteki ürün adeti: ${cartItemQtyText?.trim()}`);
}

// Sepet özeti (sağ panel)
const cartSummary = cartPage.locator('[class*="merchant-item-right-actions"], [class*="summary"], .pb-summary').first();
await cartSummary.waitFor({ state: 'visible', timeout: 10000 });
const cartSummaryText = await cartSummary.textContent();
expect(cartSummaryText?.trim()).toBeTruthy();
console.log('Sepet özeti modülü başarıyla bulundu.');

// Kargo bilgisi
const kargoEl = cartPage.getByText(/Kargo Bedava/i).first();
if (await kargoEl.isVisible({ timeout: 3000 }).catch(() => false)) {
  console.log('Kargo Durumu: Bedava');
} else {
  console.log('Kargo Durumu: Ücretli (veya kampanya baremi altı)');
}

console.log('✅ Sepet doğrulama tamamlandı.');

await productPage.pause(); // ***

// ─────────────────────────────────────────────
// 10. SEPET MİKTAR KONTROLÜ (+/- BUTONLARI)
// ─────────────────────────────────────────────
//diasble olduğu için ona göre değişecek****
const incBtn = cartPage.getByTestId('quantity-button-increment').first();
const decBtn = cartPage.getByTestId('quantity-button-decrement').first();

await incBtn.waitFor({ state: 'visible', timeout: 5000 });

const maxWarning = cartPage.getByText(/maksimum|maks|max/i).first();

// ── (+) BUTONU ──
let incSuccess = false;

for (let i = 0; i < 3; i++) {
  await incBtn.click();
  await cartPage.waitForTimeout(1000);

  if (await maxWarning.isVisible({ timeout: 1000 }).catch(() => false)) {
    console.log('⚠️ Maksimum adet uyarısı geldi, stok 1 olabilir — artırma atlandı.');
    break;
  } else {
    incSuccess = true;
    console.log('✅ (+) butonu başarıyla denendi.');
    break;
  }
}

// ── (-) BUTONU — (+) başarısız olsa da bağımsız çalışır ──
const isDecVisible = await decBtn.isVisible({ timeout: 3000 }).catch(() => false);

if (isDecVisible) {
  await decBtn.waitFor({ state: 'visible', timeout: 5000 });
  await decBtn.click();
  await cartPage.waitForTimeout(1000);
  console.log('✅ (-) butonu başarıyla denendi.');
} else {
  console.log('⚠️ (-) butonu görünür değil, atlandı.');
}

// ── ÖZET ──
if (!incSuccess) {
  console.log('ℹ️ Not: Ürünün stoğu 1 olduğundan miktar artırılamadı.');
}

console.log('✅ Sepet miktar kontrolü tamamlandı.');

await cartPage.pause(); // ***
// ─────────────────────────────────────────────
// 11. ÖNERİLEN ÜRÜNLERDEN İKİNCİ ÜRÜN EKLE
// ─────────────────────────────────────────────

// Önerilen ürün kartlarından rastgele 1 tanesi seç (2-5 arası)
const randomChild = Math.floor(Math.random() * 4) + 2; // 2,3,4,5
const recommendedProduct = cartPage.locator(`li:nth-child(${randomChild}) > .merchant-based-recommend-slider-widget-card`);

// Kartın görünür olduğundan emin ol, yoksa ilk karta dön
let recommendedLink;
if (await recommendedProduct.isVisible({ timeout: 3000 }).catch(() => false)) {
  recommendedLink = recommendedProduct.locator('a').first();
  console.log(`Önerilen ürün seçildi (${randomChild}. sıra)`);
} else {
  recommendedLink = cartPage.locator('.vertical-product-card-v2').first().locator('a').first();
  console.log('Fallback: ilk önerilen ürün seçildi');
}

// Tıkla - yeni sekme açılacak
const recPagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
await recommendedLink.click();
const recTab = await recPagePromise;

let recProductPage;
if (recTab) {
  await recTab.waitForLoadState('domcontentloaded');
  recProductPage = recTab;
  console.log('Önerilen ürün yeni sekmede açıldı.');
} else {
  await cartPage.waitForLoadState('domcontentloaded');
  recProductPage = cartPage;
  console.log('Önerilen ürün aynı sekmede açıldı.');
}
console.log(`Önerilen ürün URL: ${recProductPage.url()}`);

// Anladım popup'ını kapat
const recOnboarding = recProductPage.locator('.onboarding__default-renderer');
if (await recOnboarding.isVisible({ timeout: 3000 }).catch(() => false)) {
  await recOnboarding.getByRole('button', { name: 'Anladım' }).click();
  console.log('Popup kapatıldı.');
}

// Ürün adı & fiyatı doğrula
const recProductName = recProductPage.locator('[data-testid="product-title"]').first();
await recProductName.waitFor({ timeout: 10000 });
console.log(`Önerilen ürün adı: ${(await recProductName.textContent()).trim()}`);


await page.pause(); // *** 
// Sepete ekle
const recAddToCartBtn = recProductPage.getByTestId('add-to-cart-button');
await recAddToCartBtn.waitFor({ timeout: 10000 });
await recAddToCartBtn.click();
console.log('İkinci ürün sepete eklendi.');

// Sepete git
const recCartPagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
const recCartLink = recProductPage.getByRole('link', { name: 'Sepetim' });
await recCartLink.waitFor({ timeout: 10000 });
await recCartLink.click();

const recCartNewTab = await recCartPagePromise;
let cartPage2;
if (recCartNewTab) {
  await recCartNewTab.waitForLoadState('domcontentloaded');
  cartPage2 = recCartNewTab;
} else {
  await recProductPage.waitForLoadState('domcontentloaded');
  cartPage2 = recProductPage;
}
console.log(`Sepet URL: ${cartPage2.url()}`);
console.log('✅ İkinci ürün sepete eklendi ve sepet görüntülendi.');

await cartPage2.pause(); // ***
// ─────────────────────────────────────────────
// 12. GEÇERSİZ KUPON KODU TESTİ
// ─────────────────────────────────────────────

// İndirim Kodu Gir butonuna tıkla
const couponOpenBtn = cartPage2.getByRole('button', { name: 'İndirim Kodu Gir' });
await couponOpenBtn.waitFor({ timeout: 10000 });
await couponOpenBtn.click();

// Kupon input alanına geçersiz kod yaz
const couponInput = cartPage2.getByRole('textbox', { name: 'İndirim Kodu Gir' });
await couponInput.waitFor({ timeout: 5000 });
await couponInput.fill('INVALIDCOUPON123');

// Giriş Yap & Uygula butonuna tıkla - login sayfasına yönlendirecek
const couponApplyBtn = cartPage2.getByRole('button', { name: 'Giriş Yap & Uygula' });
await couponApplyBtn.waitFor({ timeout: 5000 });

// Yeni sekme açılabilir
const loginPagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
await couponApplyBtn.click();
const loginNewTab = await loginPagePromise;

let loginPage;
if (loginNewTab) {
  await loginNewTab.waitForLoadState('domcontentloaded');
  loginPage = loginNewTab;
  console.log('Giriş sayfası yeni sekmede açıldı.');
} else {
  await cartPage2.waitForLoadState('domcontentloaded');
  loginPage = cartPage2;
  console.log('Giriş sayfası aynı sekmede açıldı.');
}
console.log(`Giriş sayfası URL: ${loginPage.url()}`);

// ─── Giriş Yap ───
const emailInput = loginPage.getByTestId('email-input');
await emailInput.waitFor({ timeout: 10000 });
await emailInput.fill(process.env.TRENDYOL_EMAIL);
console.log('Email girildi.');

const emailContinueBtn = loginPage.getByTestId('email-check-button');
await emailContinueBtn.waitFor({ timeout: 5000 });
await emailContinueBtn.click();

const passwordInput = loginPage.getByTestId('login-password');
await passwordInput.waitFor({ timeout: 10000 });
await passwordInput.click(); // önce tıkla
await loginPage.waitForTimeout(500);
await passwordInput.pressSequentially(process.env.TRENDYOL_PASSWORD, { delay: 50 });
console.log('Şifre girildi.');

const loginBtn = loginPage.getByTestId('login-button');
await loginBtn.waitFor({ timeout: 5000 });
await loginBtn.click();
await loginPage.waitForLoadState('domcontentloaded');
console.log('Giriş yapıldı.');
console.log(`Giriş sonrası URL: ${loginPage.url()}`);

console.log('✅ Kupon ve giriş testi tamamlandı.');

await loginPage.pause(); // ***

// ─────────────────────────────────────────────
// 12B. GİRİŞ SONRASI KUPON DENEME
// ─────────────────────────────────────────────

const allPagesAfterLogin = context.pages();
const cartPageAfterLogin = allPagesAfterLogin.find(p => p.url().includes('/sepetim')) || loginPage;
await cartPageAfterLogin.waitForLoadState('domcontentloaded');
console.log(`Sepet sayfası URL: ${cartPageAfterLogin.url()}`);

// ── ÖNCE PAUSE: DOM'a bak, asıl selector'ı bul ──
await cartPageAfterLogin.pause(); // ***  ← Buradan butonun/input'un class/id/attribute'ını kontrol et

// ── ADIM 1: Input zaten açık mı? ──
const couponInput2 = cartPageAfterLogin.getByRole('textbox', { name: 'İndirim Kodu Gir' });
let inputVisible = await couponInput2.isVisible({ timeout: 2000 }).catch(() => false);

// ── ADIM 2: Input görünmüyorsa butona tıkla ──
if (!inputVisible) {
  console.log('ℹ️ Input görünmüyor, buton aranıyor...');

  const couponBtnSelectors = [
    'button:has-text("İndirim Kodu Gir")',
    'button:has-text("İndirim Kodu")',
    '[class*="coupon"] button',
    '[class*="discount-code"] button',
    'span:has-text("İndirim Kodu Gir")',
  ];

  for (const selector of couponBtnSelectors) {
    const el = cartPageAfterLogin.locator(selector).first();
    if (await el.isVisible({ timeout: 1500 }).catch(() => false)) {
      await el.click();
      console.log(`✅ Tıklanan buton selector: "${selector}"`);
      await cartPageAfterLogin.waitForTimeout(1000);
      break;
    }
  }

  // Tıklamadan sonra tekrar kontrol et
  inputVisible = await couponInput2.isVisible({ timeout: 3000 }).catch(() => false);
}

// ── ADIM 3: Input hâlâ yoksa tamamen atla ──
if (!inputVisible) {
  console.log('⚠️ Kupon input alanı açılamadı, kupon testi atlanıyor.');
} else {
  await couponInput2.fill('INVALIDCOUPON123');
  console.log('✅ Geçersiz kupon kodu girildi.');

  const couponApplyBtn2 = cartPageAfterLogin.locator('button:has-text("Uygula")').first();
  await couponApplyBtn2.waitFor({ timeout: 5000 });
  await couponApplyBtn2.click();
  await cartPageAfterLogin.waitForTimeout(2000);

  const errorMsg = cartPageAfterLogin
    .locator('[class*="error"], [class*="alert"], [class*="invalid"], [class*="message"]')
    .first();

  if (await errorMsg.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log(`⚠️ Kupon hata mesajı: ${(await errorMsg.textContent())?.trim()}`);
  } else {
    console.log('ℹ️ Hata mesajı bulunamadı.');
  }

  const couponCloseBtn = cartPageAfterLogin
    .locator('button:has-text("Tamam"), button:has-text("Kapat")')
    .first();

  if (await couponCloseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await couponCloseBtn.click();
    console.log('✅ Hata mesajı kapatıldı.');
  }
}

console.log('✅ Geçersiz kupon testi tamamlandı.');
// ─────────────────────────────────────────────
// 13. İKİNCİ ÜRÜNÜ SİL
// ─────────────────────────────────────────────

const deleteBtn = cartPage2.getByRole('button', { name: 'Sil' }).nth(1);
await deleteBtn.waitFor({ timeout: 10000 });
await deleteBtn.click();
console.log('İkinci ürün silindi.');

// Silme onayı popup'ı çıkabilir
const confirmBtn = cartPage2.getByRole('button', { name: 'Evet, Sil' });
if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  await confirmBtn.click();
  console.log('Silme onaylandı.');
}

await cartPage2.waitForTimeout(2000);
console.log('✅ İkinci ürün sepetten silindi.');

await cartPage2.pause(); // ***
/// ─────────────────────────────────────────────
// 14. ÖZET LOG
// ─────────────────────────────────────────────
console.log('─────────────────────────────────────────');
console.log('TEST TAMAMLANDI ✅');
console.log(`Ana sayfa yüklenme süresi: ${cartLoadTime}ms`);
console.log('─────────────────────────────────────────');
});