import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Collects console errors (CSP violations show up there) for the whole test. */
function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

test('home loads with SEO basics and a clean console', async ({ page }) => {
  const errors = watchConsole(page);
  await page.goto('/');
  await expect(page).toHaveTitle(/Лунка/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /маникюр/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Записаться' }).first()).toBeVisible();
  await page.waitForTimeout(1800);
  expect(errors).toEqual([]);
});

test('no horizontal scroll from 320 to 1440 px', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow, `width ${width}`).toBeLessThanOrEqual(0);
  }
});

test('no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1800);
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([]);
});

test('every in-page link points at an existing section', async ({ page }) => {
  await page.goto('/');
  const hashes = await page.$$eval('a[href*="#"]', (as) => [...new Set(as.map((a) => new URL((a as HTMLAnchorElement).href).hash))]);
  for (const h of hashes.filter(Boolean)) await expect(page.locator(h), h).toHaveCount(1);
});

test('helper recommends a service and prefills the booking form', async ({ page }) => {
  await page.goto('/#vybor');
  await page.locator('label.opt', { hasText: 'Цвет, который держится' }).click();
  await page.locator('label.opt', { hasText: 'Тонкие, ломаются' }).click();
  const result = page.locator('[data-result]');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Укрепление и гель-лак');
  await expect(result).toContainText('3 400');
  await result.getByRole('link', { name: 'Записаться на это' }).click();
  await expect(page.locator('#b-service')).toHaveValue('strength');
  await expect(page.locator('[data-s-price]')).toHaveText(/3\s400/);
});

test('booking form shows errors, then a demo confirmation', async ({ page }) => {
  await page.goto('/#zapis');
  await page.getByRole('button', { name: 'Записаться' }).click();
  const errors = page.locator('[data-errors]');
  await expect(errors).toBeVisible();
  await expect(errors.locator('li')).toHaveCount(6);
  await expect(errors).toBeFocused();

  await page.locator('#b-service').selectOption('gel');
  await page.getByText('Снять покрытие другого салона').click();
  await expect(page.locator('[data-s-price]')).toHaveText(/3\s200/);
  const tomorrow = new Date(Date.now() + 86_400_000);
  const iso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  await page.locator('#b-date').fill(iso);
  await page.locator('label.chip', { hasText: 'Вечер' }).click();
  await page.locator('#b-name').fill('Катя');
  await page.locator('#b-phone').fill('89123456789');
  await page.locator('#b-phone').blur();
  await expect(page.locator('#b-phone')).toHaveValue('+7 (912) 345-67-89');
  await page.getByText('Даю согласие').click();
  await page.getByRole('button', { name: 'Записаться' }).click();

  const done = page.locator('[data-done]');
  await expect(done).toBeVisible();
  await expect(done).toContainText('никуда не отправлена');
  await expect(done).toContainText('+7 (912) ***-**-89');
  await done.getByRole('button', { name: 'Очистить и начать заново' }).click();
  await expect(page.locator('#b-name')).toHaveValue('');
  // Nothing is stored in the browser.
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length + document.cookie.length)).toBe(0);
});

test('gallery filters and opens a keyboard-friendly lightbox', async ({ page }) => {
  await page.goto('/#raboty');
  const visible = page.locator('[data-grid] > .work:visible');
  await expect(visible).toHaveCount(12);
  await page.locator('label.chip', { hasText: 'Педикюр' }).click();
  await expect(visible).toHaveCount(4);
  await page.locator('label.chip', { hasText: 'Все' }).click();
  await page.getByRole('button', { name: /Показать все работы/ }).click();
  await expect(visible).toHaveCount(24);

  await visible.first().locator('button').click();
  const box = page.locator('[data-lightbox]');
  await expect(box).toBeVisible();
  await expect(box.locator('[data-lb-count]')).toHaveText('1 из 24');
  await page.keyboard.press('ArrowRight');
  await expect(box.locator('[data-lb-count]')).toHaveText('2 из 24');
  await page.keyboard.press('Escape');
  await expect(box).toBeHidden();
  await expect(visible.first().locator('button')).toBeFocused();
});

test('mobile menu opens, closes with Escape and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Меню' });
  await open.click();
  const menu = page.locator('[data-menu]');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(open).toBeFocused();
  await open.click();
  await menu.getByRole('link', { name: 'Цены' }).click();
  await expect(menu).toBeHidden();
  await expect(page.locator('#ceny-title')).toBeFocused();
});

test('reduced motion shows the hero immediately', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('.hand')).toHaveCSS('opacity', '1');
  await expect(page.locator('#hero-title')).toHaveCSS('opacity', '1');
  await ctx.close();
});

test('privacy, 404, robots and sitemap', async ({ page, request }) => {
  await page.goto('/privacy/');
  await expect(page.locator('h1')).toHaveText('Политика конфиденциальности');
  const missing = await page.goto('/net-takoy-stranicy/');
  expect(missing?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Такой страницы нет');
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
  expect((await request.get('/sitemap-index.xml')).ok()).toBe(true);
});

test('all requests stay on the same origin', async ({ page, baseURL }) => {
  const foreign: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (!['data:', 'blob:'].includes(u.protocol) && u.origin !== new URL(baseURL!).origin) foreign.push(r.url());
  });
  await page.goto('/');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  expect(foreign).toEqual([]);
});
