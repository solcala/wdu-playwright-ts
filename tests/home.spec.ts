import { test, expect } from '@/fixtures/base-test';

test.describe('Home Page', () => {
  test('navigate to home page', { tag: ['@smoke', '@regression'] }, async ({ homePage }) => {

    await homePage.navigateTo();

    await test.step('verify title', async () => {
      await expect(homePage.page).toHaveTitle(/WebDriverUniversity/);
    });

    await test.step('verify heading', async () => {
      await expect(homePage.heading).toBeVisible();
    });
  });
});
