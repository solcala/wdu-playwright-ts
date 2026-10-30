import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class ButtonClicksPage extends BasePage {

  readonly path = '/Click-Buttons/index.html';
  readonly webElementClickButton: Locator;
  readonly webElementClickModal: Locator;
  readonly webElementClickModalTitle: Locator;
  readonly webElementClickModalMessage: Locator;
  readonly webElementClickModalCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * The control is a span, not a button, so it has no button role.
     * The other labels start with the same words, so the match is exact.
     */
    this.webElementClickButton = page.getByText('CLICK ME!', { exact: true });
    /**
     * All three modals use role="dialog" and none has an accessible name.
     * This one stays in the page when it is hidden, so the id is the unambiguous locator.
     */
    this.webElementClickModal = page.locator('#myModalClick');
    this.webElementClickModalTitle = this.webElementClickModal.getByRole('heading', { name: 'Congratulations!' });
    this.webElementClickModalMessage = this.webElementClickModal.getByText(
      'Well done for successfully using the click() method!',
      { exact: true },
    );
    this.webElementClickModalCloseButton = this.webElementClickModal.getByRole('button', { name: 'Close', exact: true });
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
}
