import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class AutocompletePage extends BasePage {
  readonly path = '/Autocomplete-TextField/autocomplete-textfield.html';
  readonly pageHeading: Locator;
  readonly foodItemField: Locator;
  readonly submitButton: Locator;
  readonly suggestionList: Locator;
  readonly suggestions: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Autocomplete TextField', exact: true });
    /**
     * The field has no label. Its accessible name is the placeholder, Food Item.
     */
    this.foodItemField = page.getByRole('textbox', { name: 'Food Item', exact: true });
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
    /**
     * The list has no role. Its id is the field id, myInput, plus autocomplete-list.
     * The rows are the direct child divs. They have no role, name, or id.
     * The list's own text repeats its only row when one food matches, so the row is the child div.
     */
    this.suggestionList = page.locator('#myInputautocomplete-list');
    this.suggestions = this.suggestionList.locator('> div');
  }

  /**
   * Types a food item. The page rebuilds the suggestion list from that value.
   * @param value - The text entered in the Food Item field
   */
  async typeFoodItem(value: string): Promise<void> {
    await this.foodItemField.fill(value);
  }

  /**
   * Returns the suggestion row with that exact catalog name.
   * @param name - The catalog text, for example Pizza
   * @returns The suggestion row
   */
  suggestion(name: string): Locator {
    return this.suggestions.getByText(name, { exact: true });
  }

  /**
   * Clicks the suggestion with that catalog name. The page copies it into the field.
   * @param name - The catalog text, for example Pizza
   */
  async selectSuggestion(name: string): Promise<void> {
    await this.suggestion(name).click();
  }

  /**
   * Clicks Submit. The form sends the field value as food-item.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Presses Arrow Down in the field, which highlights the next suggestion.
   */
  async highlightNextSuggestion(): Promise<void> {
    await this.foodItemField.press('ArrowDown');
  }

  /**
   * Presses Enter in the field.
   * When a suggestion is highlighted, that chooses it. Enter does not submit the form.
   */
  async pressEnterInFoodItemField(): Promise<void> {
    await this.foodItemField.press('Enter');
  }

  /**
   * Clicks the page heading, outside the field and the suggestion list.
   */
  async clickOutsideSuggestions(): Promise<void> {
    await this.pageHeading.click();
  }
}
