import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class ButtonClicksPage extends BasePage {

  readonly path = '/Click-Buttons/index.html';
  readonly webElementClickButton: Locator;
  readonly webElementClickModal: Locator;
  readonly webElementClickModalTitle: Locator;
  readonly webElementClickModalCloseButton: Locator;
  readonly javaScriptClickButton: Locator;
  readonly javaScriptClickModal: Locator;
  readonly javaScriptClickModalTitle: Locator;
  readonly javaScriptClickModalCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * The control is a span, not a button, so it has no button role.
     * The other labels start with the same words, so the match is exact.
     */
    this.webElementClickButton = page.getByText('CLICK ME!', { exact: true });
    this.javaScriptClickButton = page.getByText('CLICK ME!!', { exact: true });
    /**
     * All three modals use role="dialog" and none has an accessible name.
     * Each stays in the page when it is hidden, so the id is the unambiguous locator.
     */
    this.webElementClickModal = page.locator('#myModalClick');
    this.webElementClickModalTitle = this.webElementClickModal.getByRole('heading');
    this.webElementClickModalCloseButton = this.webElementClickModal.getByRole('button', { name: 'Close', exact: true });
    this.javaScriptClickModal = page.locator('#myModalJSClick');
    this.javaScriptClickModalTitle = this.javaScriptClickModal.getByRole('heading');
    this.javaScriptClickModalCloseButton = this.javaScriptClickModal.getByRole('button', { name: 'Close', exact: true });
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
}
