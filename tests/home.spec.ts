import { test, expect } from '@playwright/test';
import { BasePage } from '@/pages/base_page';

test.describe('Home Page', () => {
  test('navigate to home page', { tag: ['@smoke', '@regression'] }, async ({ page }) => {

    const basePage = new BasePage(page);
    await basePage.navigateTo();

    await test.step('verify title', async () => {
      await expect(basePage.page).toHaveTitle(/Playwright/);
    });

    await test.step('verify heading', async () => {
      await expect(basePage.heading).toBeVisible();
    });
  });
});
