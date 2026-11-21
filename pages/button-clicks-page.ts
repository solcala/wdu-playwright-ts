import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class ButtonClicksPage extends BasePage {
  readonly path = '/Click-Buttons/index.html';
  readonly webElementClickButton: Locator;
  readonly webElementClickModal: Locator;
  readonly webElementClickModalTitle: Locator;
  readonly webElementClickModalCloseButton: Locator;
  readonly webElementClickModalDismissButton: Locator;
  readonly javaScriptClickButton: Locator;
  readonly javaScriptClickModal: Locator;
  readonly javaScriptClickModalTitle: Locator;
  readonly javaScriptClickModalCloseButton: Locator;
  readonly javaScriptClickModalDismissButton: Locator;
  readonly actionMoveClickButton: Locator;
  readonly actionMoveClickModal: Locator;
  readonly actionMoveClickModalTitle: Locator;
  readonly actionMoveClickModalCloseButton: Locator;
  readonly actionMoveClickModalDismissButton: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * The control is a span, not a button, so it has no button role.
     * The other labels start with the same words, so the match is exact.
     */
    this.webElementClickButton = page.getByText('CLICK ME!', { exact: true });
    this.javaScriptClickButton = page.getByText('CLICK ME!!', { exact: true });
    this.actionMoveClickButton = page.getByText('CLICK ME!!!', { exact: true });
    /**
     * All three modals use role="dialog" and none has an accessible name.
     * Each stays in the page when it is hidden, so the id is the unambiguous locator.
     */
    this.webElementClickModal = page.locator('#myModalClick');
    this.webElementClickModalTitle = this.webElementClickModal.getByRole('heading');
    this.webElementClickModalCloseButton = this.webElementClickModal.getByRole('button', { name: 'Close', exact: true });
    /**
     * The header button's accessible name is ×.
     */
    this.webElementClickModalDismissButton = this.webElementClickModal.getByRole('button', { name: '×' });
    this.javaScriptClickModal = page.locator('#myModalJSClick');
    this.javaScriptClickModalTitle = this.javaScriptClickModal.getByRole('heading');
    this.javaScriptClickModalCloseButton = this.javaScriptClickModal.getByRole('button', { name: 'Close', exact: true });
    this.javaScriptClickModalDismissButton = this.javaScriptClickModal.getByRole('button', { name: '×' });
    this.actionMoveClickModal = page.locator('#myModalMoveClick');
    this.actionMoveClickModalTitle = this.actionMoveClickModal.getByRole('heading');
    this.actionMoveClickModalCloseButton = this.actionMoveClickModal.getByRole('button', { name: 'Close', exact: true });
    this.actionMoveClickModalDismissButton = this.actionMoveClickModal.getByRole('button', { name: '×' });
  }

  /**
   * Clicks the WebElement Click control. That opens its modal.
   */
  async clickWebElementButton(): Promise<void> {
    await this.webElementClickButton.click();
  }

  /**
   * Clicks Close on the WebElement Click modal.
   */
  async closeWebElementClickModal(): Promise<void> {
    await this.webElementClickModalCloseButton.click();
  }

  /**
   * Clicks the JavaScript Click control. That opens its modal.
   */
  async clickJavaScriptButton(): Promise<void> {
    await this.javaScriptClickButton.click();
  }

  /**
   * Clicks Close on the JavaScript Click modal.
   */
  async closeJavaScriptClickModal(): Promise<void> {
    await this.javaScriptClickModalCloseButton.click();
  }

  /**
   * Clicks the Action Move & Click control. That opens its modal.
   */
  async clickActionMoveButton(): Promise<void> {
    await this.actionMoveClickButton.click();
  }

  /**
   * Clicks Close on the Action Move & Click modal.
   */
  async closeActionMoveClickModal(): Promise<void> {
    await this.actionMoveClickModalCloseButton.click();
  }

  /**
   * Clicks the × button on the WebElement Click modal.
   */
  async dismissWebElementClickModal(): Promise<void> {
    await this.webElementClickModalDismissButton.click();
  }

  /**
   * Clicks the × button on the JavaScript Click modal.
   */
  async dismissJavaScriptClickModal(): Promise<void> {
    await this.javaScriptClickModalDismissButton.click();
  }

  /**
   * Clicks the × button on the Action Move & Click modal.
   */
  async dismissActionMoveClickModal(): Promise<void> {
    await this.actionMoveClickModalDismissButton.click();
  }

  /**
   * Clicks the WebElement Click overlay, outside the dialog. That dismisses the modal.
   */
  async clickWebElementClickOverlay(): Promise<void> {
    await this.clickModalOverlay(this.webElementClickModal);
  }

  /**
   * Clicks the JavaScript Click overlay, outside the dialog. That dismisses the modal.
   */
  async clickJavaScriptClickOverlay(): Promise<void> {
    await this.clickModalOverlay(this.javaScriptClickModal);
  }

  /**
   * Clicks the Action Move & Click overlay, outside the dialog. That dismisses the modal.
   */
  async clickActionMoveClickOverlay(): Promise<void> {
    await this.clickModalOverlay(this.actionMoveClickModal);
  }

  /**
   * Clicks the left edge of an open modal, outside the centered dialog.
   * @param modal - The open modal
   */
  private async clickModalOverlay(modal: Locator): Promise<void> {
    await modal.click({ position: { x: 12, y: 120 } });
  }
}
