import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class TodoListPage extends BasePage {
  readonly path = '/To-Do-List/index.html';
  readonly newTodoField: Locator;
  readonly plusIcon: Locator;
  readonly items: Locator;
  readonly blankItems: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * The placeholder is the accessible name. The field has no label.
     */
    this.newTodoField = page.getByRole('textbox', { name: 'Add new todo' });
    /**
     * The plus icon is aria-hidden, so it has no accessible name.
     * plus-icon is the unique id.
     */
    this.plusIcon = page.locator('#plus-icon');
    this.items = page.getByRole('listitem');
    /**
     * An empty Enter adds a row whose text is the template's leading space.
     * The practice items contain letters, so this filter is that blank row.
     * An index is not used.
     */
    this.blankItems = this.items.filter({ hasNotText: /[A-Za-z0-9]/ });
  }

  /**
   * Returns the to-do row whose text is exactly this name.
   * A string filter matches part of the text, so "Buy" would also match "Buy new robes".
   * The row is a span and then a space before the value. A text filter keeps that space, so the match trims it.
   * @param name - The todo text
   * @returns The matching list item
   */
  item(name: string): Locator {
    const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.items.filter({ hasText: new RegExp(`^\\s*${escaped}\\s*$`) });
  }

  /**
   * Returns the delete control for a to-do row.
   * The control is a span with no role and no accessible name. The click handler is on that span.
   * It stays at width 0 until the row is hovered.
   * @param name - The todo text
   * @returns The delete span inside that row
   */
  deleteControl(name: string): Locator {
    return this.item(name).locator('span');
  }

  /**
   * Types a todo and presses Enter. That appends a row and clears the field.
   * An empty string still appends a row. The page does not validate the value.
   * @param name - The todo text. Empty adds a blank row.
   */
  async addTodo(name: string): Promise<void> {
    await this.newTodoField.fill(name);
    await this.newTodoField.press('Enter');
  }

  /**
   * Clicks a to-do row. That toggles its completed class.
   * @param name - The todo text
   */
  async clickItem(name: string): Promise<void> {
    await this.item(name).click();
  }

  /**
   * Moves the pointer onto a to-do row. That expands its delete control.
   * @param name - The todo text
   */
  async hoverItem(name: string): Promise<void> {
    await this.item(name).hover();
  }

  /**
   * Hovers a to-do row and clicks its delete control. The row fades out and is removed.
   * @param name - The todo text
   */
  async removeItem(name: string): Promise<void> {
    await this.hoverItem(name);
    await this.deleteControl(name).click();
  }

  /**
   * Clicks the plus icon. That hides the add field, or shows it when the field is already hidden.
   */
  async toggleAddField(): Promise<void> {
    await this.plusIcon.click();
  }
}
