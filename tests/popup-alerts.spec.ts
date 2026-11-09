import { test, expect } from '@/fixtures/base-test';

/**
 * The JavaScript alert and the confirm box are spans. Each dialog method registers its listener before the click.
 * The alert writes nothing. The confirm box writes the choice into the result paragraph.
 * Modal Popup opens a Bootstrap modal. Close, ×, and a click outside the dialog hide it. Escape does not.
 * The Ajax Loader control is a link to that page. The case list is specs/popup-alerts.plan.md.
 */

const confirmOkColor = 'rgb(16, 185, 129)';
const confirmCancelColor = 'rgb(154, 154, 154)';
const confirmMessage = 'Press a button!';
const modalTitle = 'It’s that Easy!! Well I think it is.....';
const modalBody =
  'We can inject and use JavaScript code if all else fails! Remember always try to use WebDriver Library method(s) first such as WebElement.click(). (The Selenium development team have spent allot of time developing WebDriver functions etc).';

test.describe('Popup & Alerts', { tag: ['@popup-alerts'] }, () => {
  test.beforeEach(async ({ popupAlertsPage }) => {
    await popupAlertsPage.navigateTo();
  });

  test.describe('JavaScript Alert', () => {
    test('the javascript alert shows its message', { tag: ['@smoke', '@regression'] }, async ({ popupAlertsPage }) => {
      const expectedMessage = 'I am an alert box!';

      await test.step('the confirm result starts empty', async () => {
        await expect(popupAlertsPage.confirmResult).toHaveText('');
      });

      await test.step(`accept the ${expectedMessage} alert`, async () => {
        expect(await popupAlertsPage.acceptJavaScriptAlert()).toBe(expectedMessage);
      });

      await test.step('the page stays here and the confirm result stays empty', async () => {
        await expect(popupAlertsPage.confirmResult).toHaveText('');
        await expect(popupAlertsPage.page).toHaveURL(/\/Popup-Alerts\/index\.html$/);
      });
    });
  });

  test.describe('JavaScript Confirm Box', () => {
    test('accepting the confirm shows You pressed OK', { tag: ['@smoke', '@regression'] }, async ({ popupAlertsPage }) => {
      await test.step('the result starts empty', async () => {
        await expect(popupAlertsPage.confirmResult).toHaveText('');
      });

      await test.step(`accept the ${confirmMessage} confirm`, async () => {
        expect(await popupAlertsPage.acceptConfirmBox()).toBe(confirmMessage);
      });

      await test.step('the page shows You pressed OK', async () => {
        await expect(popupAlertsPage.confirmResult).toHaveText('You pressed OK!');
        await expect.soft(popupAlertsPage.confirmResult).toHaveCSS('color', confirmOkColor);
      });
    });

    test('dismissing the confirm shows You pressed Cancel', { tag: ['@regression'] }, async ({ popupAlertsPage }) => {
      await test.step('the result starts empty', async () => {
        await expect(popupAlertsPage.confirmResult).toHaveText('');
      });

      await test.step(`dismiss the ${confirmMessage} confirm`, async () => {
        expect(await popupAlertsPage.dismissConfirmBox()).toBe(confirmMessage);
      });

      await test.step('the page shows You pressed Cancel', async () => {
        await expect(popupAlertsPage.confirmResult).toHaveText('You pressed Cancel!');
        await expect.soft(popupAlertsPage.confirmResult).toHaveCSS('color', confirmCancelColor);
      });
    });

    test('a later confirm choice replaces the earlier one', { tag: ['@regression'] }, async ({ popupAlertsPage }) => {
      await test.step('OK shows You pressed OK', async () => {
        expect(await popupAlertsPage.acceptConfirmBox()).toBe(confirmMessage);
        await expect(popupAlertsPage.confirmResult).toHaveText('You pressed OK!');
      });

      await test.step('Cancel replaces that result', async () => {
        expect(await popupAlertsPage.dismissConfirmBox()).toBe(confirmMessage);
        await expect(popupAlertsPage.confirmResult).toHaveText('You pressed Cancel!');
        await expect.soft(popupAlertsPage.confirmResult).toHaveCSS('color', confirmCancelColor);
      });
    });
  });

  test.describe('Modal Popup', () => {
    test('modal popup shows its message', { tag: ['@smoke', '@regression'] }, async ({ popupAlertsPage }) => {
      await test.step('the modal starts hidden', async () => {
        await expect(popupAlertsPage.modalPopup).toBeHidden();
      });

      await test.step('CLICK ME! opens the modal', async () => {
        await popupAlertsPage.clickModalPopup();
        await expect(popupAlertsPage.modalPopup).toBeVisible();
        await expect.soft(popupAlertsPage.modalPopupTitle).toHaveText(modalTitle);
        await expect.soft(popupAlertsPage.modalPopup).toContainText(modalBody);
      });

      await test.step('Close hides the modal', async () => {
        await popupAlertsPage.closeModalPopup();
        await expect(popupAlertsPage.modalPopup).toBeHidden();
      });
    });

    test('the × button hides the modal and the control opens it again', { tag: ['@regression'] }, async ({ popupAlertsPage }) => {
      await test.step('× hides the modal', async () => {
        await popupAlertsPage.clickModalPopup();
        await expect(popupAlertsPage.modalPopup).toBeVisible();
        await popupAlertsPage.dismissModalPopup();
        await expect(popupAlertsPage.modalPopup).toBeHidden();
      });

      await test.step('CLICK ME! opens it again', async () => {
        await popupAlertsPage.clickModalPopup();
        await expect(popupAlertsPage.modalPopup).toBeVisible();
      });
    });

    test('a click outside the dialog hides the modal', { tag: ['@regression'] }, async ({ popupAlertsPage }) => {
      await test.step('open the modal', async () => {
        await popupAlertsPage.clickModalPopup();
        await expect(popupAlertsPage.modalPopup).toBeVisible();
      });

      await test.step('a click outside the dialog hides it', async () => {
        await popupAlertsPage.clickModalPopupOverlay();
        await expect(popupAlertsPage.modalPopup).toBeHidden();
      });
    });
  });

  test.describe('Ajax Loader', () => {
    test('the ajax loader control opens the ajax loader page', { tag: ['@regression'] }, async ({ popupAlertsPage }) => {
      await test.step('click the Ajax Loader control', async () => {
        await popupAlertsPage.openAjaxLoader();
      });

      await test.step('the Ajax Loader page is open', async () => {
        await expect(popupAlertsPage.page).toHaveURL(/\/Ajax-Loader\/index\.html$/);
      });
    });
  });
});
