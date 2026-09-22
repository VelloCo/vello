import { test, expect } from '@playwright/test';

const baseUrl = process.env.VELLO_BASE_URL || 'https://velloesteticas.vercel.app';

test.describe('Vello – fluxo público e proteção de rotas', () => {
  test('landing carrega com metadata e CTA de cadastro', async ({ page }) => {
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Vello/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.getByRole('link', { name: /Começar agora/i })).toBeVisible();
  });

  test('autenticação expõe os fluxos principais', async ({ page }) => {
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Bem-vindo de volta/i })).toBeVisible();
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Esqueci minha senha/i })).toBeVisible();
    await page.getByRole('link', { name: /Criar conta/i }).click();
    await expect(page).toHaveURL(/\/cadastro$/);
    await expect(page.getByRole('heading', { name: /Crie sua conta/i })).toBeVisible();
  });

  test('rotas privadas não ficam expostas sem sessão', async ({ page }) => {
    for (const path of ['/dashboard', '/dashboard/servicos/novo', '/onboarding', '/admin']) {
      await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
    }
  });

  test('404 personalizada aparece para rota inexistente', async ({ page }) => {
    await page.goto(`${baseUrl}/rota-que-nao-existe`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Esta página não foi encontrada/i })).toBeVisible({ timeout: 10000 });
  });

  test('landing continua utilizável no celular', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: /Começar agora/i })).toBeVisible();
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(horizontalOverflow).toBe(false);
  });
});
