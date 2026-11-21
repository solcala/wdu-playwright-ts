import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class PopupAlertsPage extends BasePage {
  readonly path = '/Popup-Alerts/index.html';
  readonly javascriptAlertControl: Locator;
  readonly confirmBoxControl: Locator;
  readonly confirmResult: Locator;
  readonly modalPopupControl: Locator;
  readonly modalPopup: Locator;
  readonly modalPopupTitle: Locator;
  readonly modalPopupCloseButton: Locator;
  readonly modalPopupDismissButton: Locator;
  readonly ajaxLoaderLink: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * The four labels are all CLICK ME!. The alert, confirm, and modal controls are spans,
     * so they have no button role. Each id is unique.
     */
    this.javascriptAlertControl = page.locator('#button1');
    this.confirmBoxControl = page.locator('#button4');
    /**
     * The paragraph starts empty. Its text is the confirm result, so the id is the locator.
     */
    this.confirmResult = page.locator('#confirm-alert-text');
    this.modalPopupControl = page.locator('#button2');
    /**
     * The modal uses role="dialog" and has no accessible name.
     * It stays in the page when it is hidden, so the id is the locator.
     */
    this.modalPopup = page.locator('#myModal');
    this.modalPopupTitle = this.modalPopup.getByRole('heading');
    this.modalPopupCloseButton = this.modalPopup.getByRole('button', { name: 'Close', exact: true });
    /**
     * The header button's accessible name is ×.
     */
    this.modalPopupDismissButton = this.modalPopup.getByRole('button', { name: '×' });
    /**
     * The other CLICK ME! labels are spans. This is the only link with that name.
     */
    this.ajaxLoaderLink = page.getByRole('link', { name: 'CLICK ME!', exact: true });
  }

  /**
   * Clicks the JavaScript Alert control and accepts the alert.
   * @returns The alert message text
   */
  async acceptJavaScriptAlert(): Promise<string> {
    return this.closeDialog(this.javascriptAlertControl, true);
  }

  /**
   * Clicks the confirm control and accepts the dialog.
   * @returns The confirm message text
   */
  async acceptConfirmBox(): Promise<string> {
    return this.closeDialog(this.confirmBoxControl, true);
  }

  /**
   * Clicks the confirm control and dismisses the dialog.
   * @returns The confirm message text
   */
  async dismissConfirmBox(): Promise<string> {
    return this.closeDialog(this.confirmBoxControl, false);
  }

  /**
   * Clicks the Modal Popup control. That opens the modal.
   */
  async clickModalPopup(): Promise<void> {
    await this.modalPopupControl.click();
  }

  /**
   * Clicks Close on the modal.
   */
  async closeModalPopup(): Promise<void> {
    await this.modalPopupCloseButton.click();
  }

  /**
   * Clicks the × button on the modal.
   */
  async dismissModalPopup(): Promise<void> {
    await this.modalPopupDismissButton.click();
  }

  /**
   * Clicks the modal overlay, outside the dialog. That dismisses the modal.
   */
  async clickModalPopupOverlay(): Promise<void> {
    await this.clickModalOverlay(this.modalPopup);
  }

  /**
   * Clicks the Ajax Loader link. That opens the Ajax Loader page.
   */
  async openAjaxLoader(): Promise<void> {
    await this.ajaxLoaderLink.click();
  }

  /**
   * Clicks a control that opens a dialog, then closes the dialog.
   * The listener is registered before the click, because the alert is gone if nothing is listening.
   * @param control - The control that opens the dialog
   * @param accept - True presses OK. False presses Cancel
   * @returns The dialog message text
   */
  private async closeDialog(control: Locator, accept: boolean): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog');
    const clickPromise = control.click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    if (accept) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
    await clickPromise;
    return message;
  }

  /**
   * Clicks the open modal outside its dialog panel. That dismisses the modal.
   * The panel is `.modal-dialog`. It has no accessible name, and the heading is smaller than the panel, so the class is the locator.
   * @param modal - The open modal
   */
  private async clickModalOverlay(modal: Locator): Promise<void> {
    const dialog = modal.locator('.modal-dialog');
    const overlayBox = await modal.boundingBox();
    const dialogBox = await dialog.boundingBox();
    if (!overlayBox || !dialogBox) {
      throw new Error('The modal overlay is not visible');
    }

    await modal.click({ position: this.pointOutsideDialog(overlayBox, dialogBox) });
  }

  /**
   * Returns a point on the overlay, in the overlay's coordinates, that falls outside the dialog.
   * @param overlayBox - The overlay bounding box, in viewport coordinates
   * @param dialogBox - The dialog bounding box, in viewport coordinates
   * @returns The click position relative to the overlay's top left
   */
  private pointOutsideDialog(
    overlayBox: { x: number; y: number; width: number; height: number },
    dialogBox: { x: number; y: number; width: number; height: number },
  ): { x: number; y: number } {
    const left = dialogBox.x - overlayBox.x;
    const top = dialogBox.y - overlayBox.y;
    const right = left + dialogBox.width;
    const bottom = top + dialogBox.height;
    const midY = Math.min(Math.max(top + dialogBox.height / 2, 1), overlayBox.height - 1);

    if (left >= 2) {
      return { x: left / 2, y: midY };
    }
    if (overlayBox.width - right >= 2) {
      return { x: right + (overlayBox.width - right) / 2, y: midY };
    }
    if (top >= 2) {
      return { x: overlayBox.width / 2, y: top / 2 };
    }
    if (overlayBox.height - bottom >= 2) {
      return { x: overlayBox.width / 2, y: bottom + (overlayBox.height - bottom) / 2 };
    }
    throw new Error('The modal dialog covers the overlay');
  }
}
