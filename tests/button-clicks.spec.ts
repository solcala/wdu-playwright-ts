import { test, expect } from '@/fixtures/base-test';

/**
 * The WebElement Click control is the span labeled CLICK ME!.
 * A click opens the Bootstrap modal with the title Congratulations! and the click() message.
 * js/script.js is wrapped in a script tag, so it is not valid JavaScript and its jQuery UI dialog never opens.
 * The JavaScript Click and Action Move & Click controls are left for a later batch.
 */

test.describe('Button Clicks', () => {

  test.beforeEach(async ({ buttonClicksPage }) => {
    await buttonClicksPage.navigateTo();
  });

  test('web element click opens the congratulations modal', { tag: ['@smoke', '@regression'] }, async ({ buttonClicksPage }) => {
    await test.step('click CLICK ME!', async () => {
      await buttonClicksPage.clickWebElementButton();
    });

    await test.step('modal shows the click() result', async () => {
      await expect(buttonClicksPage.webElementClickModal).toBeVisible();
      await expect.soft(buttonClicksPage.webElementClickModalTitle).toHaveText('Congratulations!');
      await expect.soft(buttonClicksPage.webElementClickModalMessage).toHaveText(
        'Well done for successfully using the click() method!',
      );
    });

    await test.step('Close hides the modal', async () => {
      await buttonClicksPage.closeWebElementClickModal();
      await expect(buttonClicksPage.webElementClickModal).toBeHidden();
    });
  });

});
