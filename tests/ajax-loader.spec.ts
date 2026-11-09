import { test, expect } from '@/fixtures/base-test';

/**
 * The page reveals CLICK ME! with a timer of about five seconds. Nothing is loaded with XHR or fetch.
 * The control is a span. A click opens one Bootstrap modal.
 * Close and × use data-dismiss. A click on the overlay, outside the dialog, also hides it.
 * Escape leaves the modal open. The span is not in the tab order, and Enter or Space does not open the modal.
 * The page has no fields.
 */

test.describe('Ajax Loader', { tag: ['@ajax-loader'] }, () => {
  test.beforeEach(async ({ ajaxLoaderPage }) => {
    await ajaxLoaderPage.navigateTo();
  });

  test('clicking the delayed control shows the waiting result', { tag: ['@smoke', '@regression'] }, async ({ ajaxLoaderPage }) => {
    await test.step('the loader finishes and CLICK ME! is shown', async () => {
      /**
       * The page shows this control about five seconds after load.
       * The default assertion timeout is five seconds, so this check waits longer for that condition.
       */
      await expect(ajaxLoaderPage.clickMeControl).toBeVisible({ timeout: 15_000 });
      await expect(ajaxLoaderPage.loader).toBeHidden();
    });

    await test.step('CLICK ME! opens the result', async () => {
      await ajaxLoaderPage.clickClickMe();
      await expect(ajaxLoaderPage.resultModal).toBeVisible();
      await expect.soft(ajaxLoaderPage.resultModalTitle).toHaveText('Well Done For Waiting....!!!');
      await expect
        .soft(ajaxLoaderPage.resultModal)
        .toContainText(
          'The waiting game can be a tricky one; this exercise will hopefully improve your understandings of the various types of waits.',
        );
    });

    await test.step('Close hides the modal', async () => {
      await ajaxLoaderPage.closeResultModal();
      await expect(ajaxLoaderPage.resultModal).toBeHidden();
    });
  });

  test('the result stays hidden while the loader is showing', { tag: ['@regression'] }, async ({ ajaxLoaderPage }) => {
    await test.step('the loader is showing and the result is not', async () => {
      await expect(ajaxLoaderPage.loader).toBeVisible();
      await expect(ajaxLoaderPage.clickMeControl).toBeHidden();
      await expect(ajaxLoaderPage.resultModal).toBeHidden();
    });
  });

  test('the × button hides the modal and the control opens it again', { tag: ['@regression'] }, async ({ ajaxLoaderPage }) => {
    await test.step('× hides the modal', async () => {
      await ajaxLoaderPage.clickClickMe();
      await expect(ajaxLoaderPage.resultModal).toBeVisible();
      await ajaxLoaderPage.dismissResultModal();
      await expect(ajaxLoaderPage.resultModal).toBeHidden();
    });

    await test.step('CLICK ME! opens it again', async () => {
      await ajaxLoaderPage.clickClickMe();
      await expect(ajaxLoaderPage.resultModal).toBeVisible();
    });
  });

  test('a click outside the dialog hides the modal', { tag: ['@regression'] }, async ({ ajaxLoaderPage }) => {
    await test.step('open the modal', async () => {
      await ajaxLoaderPage.clickClickMe();
      await expect(ajaxLoaderPage.resultModal).toBeVisible();
    });

    await test.step('a click outside the dialog hides it', async () => {
      await ajaxLoaderPage.clickResultModalOverlay();
      await expect(ajaxLoaderPage.resultModal).toBeHidden();
    });
  });
});
