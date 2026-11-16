import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

type WarningClick = {
  tag: string;
  className: string;
};

type WarningClickWindow = Window & {
  warningClick?: WarningClick;
};

type EnterMarkWindow = Window & {
  enterMark?: string;
  markAfterEnter?: string;
};

export class DataTablesPage extends BasePage {
  readonly path = '/Data-Table/index.html';
  readonly firstNamesTable: Locator;
  readonly secondNamesTable: Locator;
  readonly traversalTable: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly inputTextField: Locator;
  readonly resetButton: Locator;
  readonly warningButton: Locator;
  readonly dangerButton: Locator;
  readonly infoButton: Locator;
  readonly alertButton: Locator;
  readonly button1: Locator;
  readonly button2: Locator;
  readonly button3: Locator;
  readonly button4: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * The name tables have no caption and no accessible name.
     * t01 is the first table. t02 is the second. Both use the same headers.
     */
    this.firstNamesTable = page.locator('#t01');
    this.secondNamesTable = page.locator('#t02');
    /**
     * The table under the Table heading has no accessible name and no id.
     * traversal-table is the stable class on that table.
     */
    this.traversalTable = page.locator('table.traversal-table');
    /**
     * The first name field has no label, placeholder, or id.
     * The name attribute is unique.
     */
    this.firstNameField = page.locator('#form-textfield input[name="firstname"]');
    /**
     * The last name field has no label, placeholder, or id.
     * The name attribute is unique.
     */
    this.lastNameField = page.locator('#form-textfield input[name="lastname"]');
    /**
     * The text area has no label, name, or id. The form id scopes it.
     * The paragraph above it is not a label.
     */
    this.inputTextField = page.locator('#form-textfield textarea');
    this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
    this.warningButton = page.getByRole('button', { name: 'Warning', exact: true });
    this.dangerButton = page.getByRole('button', { name: 'Danger', exact: true });
    this.infoButton = page.getByRole('button', { name: 'Info', exact: true });
    this.alertButton = page.getByRole('button', { name: 'Alert', exact: true });
    this.button1 = page.getByRole('button', { name: 'Button-1', exact: true });
    this.button2 = page.getByRole('button', { name: 'Button-2', exact: true });
    this.button3 = page.getByRole('button', { name: 'Button-3', exact: true });
    this.button4 = page.getByRole('button', { name: 'Button-4', exact: true });
  }

  /**
   * Returns the row whose accessible name is this text.
   * The name is the cells in order, so "John Smith 45" is one row.
   * An exact name keeps "Jones" from matching "Jason Jones 27".
   * @param table - The table that contains the row
   * @param name - The accessible name of the row
   * @returns The matching row
   */
  row(table: Locator, name: string): Locator {
    return table.getByRole('row', { name, exact: true });
  }

  /**
   * Fills the first name, the last name, and the text area.
   * @param firstName - The first name
   * @param lastName - The last name
   * @param text - The text area value
   */
  async fillForm(firstName: string, lastName: string, text: string): Promise<void> {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.inputTextField.fill(text);
  }

  /**
   * Fills both name fields and presses Enter in the first name field.
   * The form has no submit button, so Enter does not submit it.
   * @param firstName - The first name
   * @param lastName - The last name
   */
  async enterNames(firstName: string, lastName: string): Promise<void> {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.firstNameField.press('Enter');
  }

  /**
   * Marks this document so a later check can tell it from a reload.
   * beforeunload clears the mark when a navigation starts, which is before the new page loads.
   * The mark is recorded again when Enter finishes, and only if it is still there.
   * @returns The mark stored on this document
   */
  async markDocument(): Promise<string> {
    const mark = 'data-tables-enter';
    await this.page.evaluate((value) => {
      const view = window as EnterMarkWindow;
      view.enterMark = value;
      delete view.markAfterEnter;
      window.addEventListener(
        'beforeunload',
        () => {
          delete view.enterMark;
        },
        { once: true },
      );
      const onKeyUp = (event: KeyboardEvent) => {
        if (event.key !== 'Enter') {
          return;
        }
        document.removeEventListener('keyup', onKeyUp, true);
        if (view.enterMark === value) {
          view.markAfterEnter = value;
        }
      };
      document.addEventListener('keyup', onKeyUp, true);
    }, mark);
    return mark;
  }

  /**
   * Returns the mark recorded when Enter finished on this document.
   * A reload has none, because the mark was cleared when the navigation started.
   * @returns The mark from markDocument, or an empty string when Enter did not finish here
   */
  async documentMark(): Promise<string> {
    return this.page.evaluate(() => (window as EnterMarkWindow).markAfterEnter ?? '');
  }

  /**
   * Clicks Reset. The name fields are outside that control's form, so the values stay.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks Button-2. The active class stays on Button-1.
   */
  async clickButton2(): Promise<void> {
    await this.button2.click();
  }

  /**
   * Clicks the center of Warning with the pointer.
   * The button is below the fold, and a pointer click uses viewport coordinates, so this scrolls it into view first.
   * pointer-events is none, so the click lands on the group behind the button.
   * The listener is registered before the click, because the event is gone if nothing is listening.
   * @returns The tag and class of the element that received the click
   */
  async clickWarningButton(): Promise<WarningClick> {
    await this.warningButton.scrollIntoViewIfNeeded();
    await this.page.waitForFunction(() => {
      const button = [...document.querySelectorAll('button')].find((element) => element.textContent?.trim() === 'Warning');
      if (!button) {
        return false;
      }
      const box = button.getBoundingClientRect();
      return getComputedStyle(button).pointerEvents === 'none' && box.top >= 0 && box.bottom <= window.innerHeight;
    });

    const box = await this.warningButton.boundingBox();
    if (!box) {
      throw new Error('The warning button has no layout box');
    }

    await this.listenForClick();
    await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    return this.recordedClick();
  }

  /**
   * Focuses Danger and presses Tab. The next control is Warning when Warning is in the tab order.
   */
  async tabFromDanger(): Promise<void> {
    await this.dangerButton.focus();
    await this.page.keyboard.press('Tab');
  }

  /**
   * Presses Space or Enter on the focused control.
   * The listener is registered before the key, because the event is gone if nothing is listening.
   * @param key - Space or Enter
   * @returns The tag and class of the element that received the click
   */
  async pressFocusedKey(key: 'Space' | 'Enter'): Promise<WarningClick> {
    await this.listenForClick();
    await this.page.keyboard.press(key);
    return this.recordedClick();
  }

  /**
   * Records the next click on the document.
   */
  private async listenForClick(): Promise<void> {
    await this.page.evaluate(() => {
      const view = window as WarningClickWindow;
      delete view.warningClick;
      document.addEventListener(
        'click',
        (event) => {
          const element = event.target instanceof HTMLElement ? event.target : null;
          view.warningClick = {
            tag: element?.tagName ?? '',
            className: element?.className ?? '',
          };
        },
        { capture: true, once: true },
      );
    });
  }

  /**
   * Returns the click recorded by listenForClick.
   * @returns The tag and class of the element that received the click
   */
  private async recordedClick(): Promise<WarningClick> {
    await this.page.waitForFunction(() => (window as WarningClickWindow).warningClick !== undefined);
    return this.page.evaluate(() => {
      const view = window as WarningClickWindow;
      const hit = view.warningClick;
      delete view.warningClick;
      if (!hit) {
        throw new Error('The click listener did not run');
      }
      return hit;
    });
  }
}
