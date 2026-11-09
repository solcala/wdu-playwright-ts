import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class AjaxLoaderPage extends BasePage {
  readonly path = '/Ajax-Loader/index.html';
  readonly loader: Locator;
  readonly clickMeControl: Locator;
  readonly resultModal: Locator;
  readonly resultModalTitle: Locator;
  readonly resultModalCloseButton: Locator;
  readonly resultModalDismissButton: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * The spinner has no text and no role. The id is the locator.
     */
    this.loader = page.locator('#loader');
    /**
     * The control is a span, not a button, so it has no button role.
     * The visible label is the paragraph CLICK ME!, and that text is unique.
     */
    this.clickMeControl = page.getByText('CLICK ME!', { exact: true });
    /**
     * The modal uses role="dialog" and has no accessible name.
     * It stays in the page when it is hidden, so the id is the locator.
     */
    this.resultModal = page.locator('#myModalClick');
    this.resultModalTitle = this.resultModal.getByRole('heading');
    this.resultModalCloseButton = this.resultModal.getByRole('button', { name: 'Close', exact: true });
    /**
     * The header button's accessible name is ×.
     */
    this.resultModalDismissButton = this.resultModal.getByRole('button', { name: '×' });
  }

  /**
   * Clicks CLICK ME!. That opens the result modal.
   */
  async clickClickMe(): Promise<void> {
    await this.clickMeControl.click();
  }

  /**
   * Clicks Close on the result modal.
   */
  async closeResultModal(): Promise<void> {
    await this.resultModalCloseButton.click();
  }

  /**
   * Clicks the × button on the result modal.
   */
  async dismissResultModal(): Promise<void> {
    await this.resultModalDismissButton.click();
  }

  /**
   * Clicks the result overlay, outside the dialog. That dismisses the modal.
   */
  async clickResultModalOverlay(): Promise<void> {
    await this.clickModalOverlay(this.resultModal);
  }

  /**
   * Clicks the left edge of an open modal, outside the centered dialog.
   * @param modal - The open modal
   */
  private async clickModalOverlay(modal: Locator): Promise<void> {
    await modal.click({ position: { x: 12, y: 120 } });
  }
}
