import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class AccordionItemsPage extends BasePage {
  readonly path = '/Accordion/index.html';
  readonly manualTestingButton: Locator;
  readonly manualTestingPanel: Locator;
  readonly cucumberBddButton: Locator;
  readonly cucumberBddPanel: Locator;
  readonly automationTestingButton: Locator;
  readonly automationTestingPanel: Locator;
  readonly keepClickingButton: Locator;
  readonly keepClickingPanel: Locator;
  readonly loadingMessage: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * Each header is a button. Its CSS ::after icon is part of the accessible name:
     * a plus while closed, a minus while open. The visible label is the stable part, so the name is not exact.
     */
    this.manualTestingButton = page.getByRole('button', { name: 'Manual Testing' });
    this.cucumberBddButton = page.getByRole('button', { name: 'Cucumber BDD' });
    this.automationTestingButton = page.getByRole('button', { name: 'Automation Testing' });
    this.keepClickingButton = page.getByRole('button', { name: 'Keep Clicking! - Text will Appear After 5 Seconds!' });
    /**
     * The panels are divs. None of them has an accessible name. Each id is the panel for that button.
     * A closed panel has max-height 0 and overflow hidden. The text inside still has a box,
     * so a visibility check does not say whether the panel is open.
     */
    this.manualTestingPanel = page.locator('#manual-testing-description');
    this.cucumberBddPanel = page.locator('#cucumber-testing-description');
    this.automationTestingPanel = page.locator('#automation-testing-description');
    this.keepClickingPanel = page.locator('#timeout');
    /**
     * The line under the accordions changes from LOADING.. PLEASE WAIT.. to LOADING COMPLETE.
     * The text changes, so the id is the locator.
     */
    this.loadingMessage = page.locator('#hidden-text');
  }

  /**
   * Clicks Manual Testing. That toggles its panel.
   */
  async clickManualTesting(): Promise<void> {
    await this.manualTestingButton.click();
  }

  /**
   * Clicks Cucumber BDD. That toggles its panel.
   */
  async clickCucumberBdd(): Promise<void> {
    await this.cucumberBddButton.click();
  }

  /**
   * Clicks Automation Testing. That toggles its panel.
   */
  async clickAutomationTesting(): Promise<void> {
    await this.automationTestingButton.click();
  }

  /**
   * Clicks Keep Clicking. That toggles its panel.
   */
  async clickKeepClicking(): Promise<void> {
    await this.keepClickingButton.click();
  }

  /**
   * Clicks the loading line under the accordions.
   */
  async clickLoadingMessage(): Promise<void> {
    await this.loadingMessage.click();
  }

  /**
   * Hovers Cucumber BDD. Hover does not toggle the panel.
   */
  async hoverCucumberBdd(): Promise<void> {
    await this.cucumberBddButton.hover();
  }

  /**
   * Focuses Cucumber BDD and presses Enter. That toggles the panel.
   */
  async pressEnterOnCucumberBdd(): Promise<void> {
    await this.cucumberBddButton.focus();
    await this.page.keyboard.press('Enter');
  }

  /**
   * Focuses Cucumber BDD and presses Space. That toggles the panel.
   */
  async pressSpaceOnCucumberBdd(): Promise<void> {
    await this.cucumberBddButton.focus();
    await this.page.keyboard.press('Space');
  }
}
