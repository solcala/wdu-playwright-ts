import { test, expect } from '@/fixtures/base-test';

/**
 * Each control is a span. A normal click opens that control's Bootstrap modal.
 * The columns ask for an XPath click, a JavaScript click, and an action move and click.
 * None of the controls move, and a normal click opens all three.
 * js/script.js is wrapped in a script tag, so it never runs and its jQuery UI dialog stays hidden.
 * Escape leaves a modal open. The open modal covers its control, so a second click never lands.
 */

test.describe('Button Clicks', { tag: ['@button-clicks'] }, () => {
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
      await expect.soft(buttonClicksPage.webElementClickModal).toContainText('Well done for successfully using the click() method!');
    });

    await test.step('Close hides the modal', async () => {
      await buttonClicksPage.closeWebElementClickModal();
      await expect(buttonClicksPage.webElementClickModal).toBeHidden();
    });
  });

  test('javascript click opens its modal', { tag: ['@smoke', '@regression'] }, async ({ buttonClicksPage }) => {
    await test.step('click CLICK ME!!', async () => {
      await buttonClicksPage.clickJavaScriptButton();
    });

    await test.step('modal shows the JavaScript click result', async () => {
      await expect(buttonClicksPage.javaScriptClickModal).toBeVisible();
      await expect.soft(buttonClicksPage.javaScriptClickModalTitle).toHaveText('It’s that Easy!! Well I think it is.....');
      await expect.soft(buttonClicksPage.javaScriptClickModal).toContainText('We can use JavaScript code if all else fails!');
    });

    await test.step('Close hides the modal', async () => {
      await buttonClicksPage.closeJavaScriptClickModal();
      await expect(buttonClicksPage.javaScriptClickModal).toBeHidden();
    });
  });

  test('action move and click opens its modal', { tag: ['@smoke', '@regression'] }, async ({ buttonClicksPage }) => {
    await test.step('click CLICK ME!!!', async () => {
      await buttonClicksPage.clickActionMoveButton();
    });

    await test.step('modal shows the action move result', async () => {
      await expect(buttonClicksPage.actionMoveClickModal).toBeVisible();
      await expect
        .soft(buttonClicksPage.actionMoveClickModalTitle)
        .toHaveText('Well done! the Action Move & Click can become very useful!');
      await expect
        .soft(buttonClicksPage.actionMoveClickModal)
        .toContainText('Advanced user interactions (API) has been developed to enable you to perform more complex interactions such as:');
    });

    await test.step('Close hides the modal', async () => {
      await buttonClicksPage.closeActionMoveClickModal();
      await expect(buttonClicksPage.actionMoveClickModal).toBeHidden();
    });
  });

  test('a click opens only that modal', { tag: ['@regression'] }, async ({ buttonClicksPage }) => {
    await test.step('every modal is hidden', async () => {
      await expect(buttonClicksPage.webElementClickModal).toBeHidden();
      await expect(buttonClicksPage.javaScriptClickModal).toBeHidden();
      await expect(buttonClicksPage.actionMoveClickModal).toBeHidden();
    });

    await test.step('CLICK ME! opens only its modal', async () => {
      await buttonClicksPage.clickWebElementButton();
      await expect(buttonClicksPage.webElementClickModal).toBeVisible();
      await expect.soft(buttonClicksPage.javaScriptClickModal).toBeHidden();
      await expect.soft(buttonClicksPage.actionMoveClickModal).toBeHidden();
      await buttonClicksPage.closeWebElementClickModal();
      await expect(buttonClicksPage.webElementClickModal).toBeHidden();
    });

    await test.step('CLICK ME!! opens only its modal', async () => {
      await buttonClicksPage.clickJavaScriptButton();
      await expect(buttonClicksPage.javaScriptClickModal).toBeVisible();
      await expect.soft(buttonClicksPage.webElementClickModal).toBeHidden();
      await expect.soft(buttonClicksPage.actionMoveClickModal).toBeHidden();
      await buttonClicksPage.closeJavaScriptClickModal();
      await expect(buttonClicksPage.javaScriptClickModal).toBeHidden();
    });

    await test.step('CLICK ME!!! opens only its modal', async () => {
      await buttonClicksPage.clickActionMoveButton();
      await expect(buttonClicksPage.actionMoveClickModal).toBeVisible();
      await expect.soft(buttonClicksPage.webElementClickModal).toBeHidden();
      await expect.soft(buttonClicksPage.javaScriptClickModal).toBeHidden();
      await buttonClicksPage.closeActionMoveClickModal();
      await expect(buttonClicksPage.actionMoveClickModal).toBeHidden();
    });
  });

  test('the × button hides the modal and the control opens it again', { tag: ['@regression'] }, async ({ buttonClicksPage }) => {
    await test.step('CLICK ME!', async () => {
      await buttonClicksPage.clickWebElementButton();
      await expect(buttonClicksPage.webElementClickModal).toBeVisible();
      await buttonClicksPage.dismissWebElementClickModal();
      await expect(buttonClicksPage.webElementClickModal).toBeHidden();
      await buttonClicksPage.clickWebElementButton();
      await expect(buttonClicksPage.webElementClickModal).toBeVisible();
      await buttonClicksPage.closeWebElementClickModal();
      await expect(buttonClicksPage.webElementClickModal).toBeHidden();
    });

    await test.step('CLICK ME!!', async () => {
      await buttonClicksPage.clickJavaScriptButton();
      await expect(buttonClicksPage.javaScriptClickModal).toBeVisible();
      await buttonClicksPage.dismissJavaScriptClickModal();
      await expect(buttonClicksPage.javaScriptClickModal).toBeHidden();
      await buttonClicksPage.clickJavaScriptButton();
      await expect(buttonClicksPage.javaScriptClickModal).toBeVisible();
      await buttonClicksPage.closeJavaScriptClickModal();
      await expect(buttonClicksPage.javaScriptClickModal).toBeHidden();
    });

    await test.step('CLICK ME!!!', async () => {
      await buttonClicksPage.clickActionMoveButton();
      await expect(buttonClicksPage.actionMoveClickModal).toBeVisible();
      await buttonClicksPage.dismissActionMoveClickModal();
      await expect(buttonClicksPage.actionMoveClickModal).toBeHidden();
      await buttonClicksPage.clickActionMoveButton();
      await expect(buttonClicksPage.actionMoveClickModal).toBeVisible();
      await buttonClicksPage.closeActionMoveClickModal();
      await expect(buttonClicksPage.actionMoveClickModal).toBeHidden();
    });
  });

  test('a click outside the dialog hides the modal', { tag: ['@regression'] }, async ({ buttonClicksPage }) => {
    await test.step('CLICK ME!', async () => {
      await buttonClicksPage.clickWebElementButton();
      await expect(buttonClicksPage.webElementClickModal).toBeVisible();
      await buttonClicksPage.clickWebElementClickOverlay();
      await expect(buttonClicksPage.webElementClickModal).toBeHidden();
    });

    await test.step('CLICK ME!!', async () => {
      await buttonClicksPage.clickJavaScriptButton();
      await expect(buttonClicksPage.javaScriptClickModal).toBeVisible();
      await buttonClicksPage.clickJavaScriptClickOverlay();
      await expect(buttonClicksPage.javaScriptClickModal).toBeHidden();
    });

    await test.step('CLICK ME!!!', async () => {
      await buttonClicksPage.clickActionMoveButton();
      await expect(buttonClicksPage.actionMoveClickModal).toBeVisible();
      await buttonClicksPage.clickActionMoveClickOverlay();
      await expect(buttonClicksPage.actionMoveClickModal).toBeHidden();
    });
  });
});
