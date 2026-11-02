import { test, expect } from '@/fixtures/base-test';

/**
 * The WebElement Click control is the span labeled CLICK ME!.
 * A click opens the Bootstrap modal with the title Congratulations! and the click() message.
 * js/script.js is wrapped in a script tag, so it is not valid JavaScript and its jQuery UI dialog never opens.
 * JavaScript Click is the span labeled CLICK ME!!. A normal click opens its modal.
 * The page text asks for a JavaScript click. The control is a Bootstrap toggle, so a normal click is what opens it.
 * Action Move & Click is the span labeled CLICK ME!!!. A normal click opens its modal.
 * The page text asks for an action move and click. The control does not move, and a normal click opens it.
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
      await expect.soft(buttonClicksPage.webElementClickModal).toContainText(
        'Well done for successfully using the click() method!',
      );
    });

    await test.step('Close hides the modal', async () => {
      await buttonClicksPage.closeWebElementClickModal();
      await expect(buttonClicksPage.webElementClickModal).toBeHidden();
    });
  });

  test('javascript click opens its modal', { tag: ['@smoke'] }, async ({ buttonClicksPage }) => {
    await test.step('click CLICK ME!!', async () => {
      await buttonClicksPage.clickJavaScriptButton();
    });

    await test.step('modal shows the JavaScript click result', async () => {
      await expect(buttonClicksPage.javaScriptClickModal).toBeVisible();
      await expect.soft(buttonClicksPage.javaScriptClickModalTitle).toHaveText('It’s that Easy!! Well I think it is.....');
      await expect.soft(buttonClicksPage.javaScriptClickModal).toContainText(
        'We can use JavaScript code if all else fails!',
      );
    });

    await test.step('Close hides the modal', async () => {
      await buttonClicksPage.closeJavaScriptClickModal();
      await expect(buttonClicksPage.javaScriptClickModal).toBeHidden();
    });
  });

  test('action move and click opens its modal', { tag: ['@smoke'] }, async ({ buttonClicksPage }) => {
    await test.step('click CLICK ME!!!', async () => {
      await buttonClicksPage.clickActionMoveButton();
    });

    await test.step('modal shows the action move result', async () => {
      await expect(buttonClicksPage.actionMoveClickModal).toBeVisible();
      await expect.soft(buttonClicksPage.actionMoveClickModalTitle).toHaveText(
        'Well done! the Action Move & Click can become very useful!',
      );
      await expect.soft(buttonClicksPage.actionMoveClickModal).toContainText(
        'Advanced user interactions (API) has been developed to enable you to perform more complex interactions such as:',
      );
    });

    await test.step('Close hides the modal', async () => {
      await buttonClicksPage.closeActionMoveClickModal();
      await expect(buttonClicksPage.actionMoveClickModal).toBeHidden();
    });
  });

});
