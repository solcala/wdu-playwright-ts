import { test, expect } from '@/fixtures/base-test';
import { assertBotWallCleared, SITE_STATE_PATH } from '@/support/bot-wall';

test('the site browser check passes before the suite', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/');
  await assertBotWallCleared(page);
  await expect(page).toHaveTitle(/WebDriverUniversity/);
  await page.context().storageState({ path: SITE_STATE_PATH });
});
