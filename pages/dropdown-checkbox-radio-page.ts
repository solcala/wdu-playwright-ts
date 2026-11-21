import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class DropdownCheckboxRadioPage extends BasePage {
  readonly path = '/Dropdown-Checkboxes-RadioButtons/index.html';
  readonly languageDropdown: Locator;
  readonly toolDropdown: Locator;
  readonly technologyDropdown: Locator;
  readonly fruitDropdown: Locator;
  readonly orangeFruitOption: Locator;
  readonly selectedLanguageOption: Locator;
  readonly selectedToolOption: Locator;
  readonly selectedTechnologyOption: Locator;
  readonly selectedFruitOption: Locator;
  readonly option1Checkbox: Locator;
  readonly option2Checkbox: Locator;
  readonly option3Checkbox: Locator;
  readonly option4Checkbox: Locator;
  readonly greenRadio: Locator;
  readonly blueRadio: Locator;
  readonly yellowRadio: Locator;
  readonly orangeRadio: Locator;
  readonly purpleRadio: Locator;
  readonly lettuceRadio: Locator;
  readonly cabbageRadio: Locator;
  readonly pumpkinRadio: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * These selects have no accessible name, so each one uses its id.
     * The three menus are spelled dropdowm-menu-1, dropdowm-menu-2, and dropdowm-menu-3.
     * The fruit select id is fruit-selects.
     */
    this.languageDropdown = page.locator('#dropdowm-menu-1');
    this.toolDropdown = page.locator('#dropdowm-menu-2');
    this.technologyDropdown = page.locator('#dropdowm-menu-3');
    this.fruitDropdown = page.locator('#fruit-selects');
    this.orangeFruitOption = this.fruitDropdown.getByRole('option', { name: 'Orange', exact: true });
    /**
     * The option with the selected state in each dropdown.
     */
    this.selectedLanguageOption = this.languageDropdown.getByRole('option', { selected: true });
    this.selectedToolOption = this.toolDropdown.getByRole('option', { selected: true });
    this.selectedTechnologyOption = this.technologyDropdown.getByRole('option', { selected: true });
    this.selectedFruitOption = this.fruitDropdown.getByRole('option', { selected: true });
    /**
     * Each checkbox sits inside a label, so its accessible name is Option 1 through Option 4.
     */
    this.option1Checkbox = page.getByRole('checkbox', { name: 'Option 1', exact: true });
    this.option2Checkbox = page.getByRole('checkbox', { name: 'Option 2', exact: true });
    this.option3Checkbox = page.getByRole('checkbox', { name: 'Option 3', exact: true });
    this.option4Checkbox = page.getByRole('checkbox', { name: 'Option 4', exact: true });
    /**
     * The word beside each radio is a text node, not a label, so the radio has no accessible name.
     * The value attribute identifies it.
     */
    this.greenRadio = page.getByRole('radio').and(page.locator('[value="green"]'));
    this.blueRadio = page.getByRole('radio').and(page.locator('[value="blue"]'));
    this.yellowRadio = page.getByRole('radio').and(page.locator('[value="yellow"]'));
    this.orangeRadio = page.getByRole('radio').and(page.locator('[value="orange"]'));
    this.purpleRadio = page.getByRole('radio').and(page.locator('[value="purple"]'));
    this.lettuceRadio = page.getByRole('radio').and(page.locator('[value="lettuce"]'));
    this.cabbageRadio = page.getByRole('radio').and(page.locator('[value="cabbage"]'));
    this.pumpkinRadio = page.getByRole('radio').and(page.locator('[value="pumpkin"]'));
  }

  /**
   * Selects a language in the first dropdown.
   * @param label - The visible option text, for example C#
   */
  async selectLanguage(label: string): Promise<void> {
    await this.languageDropdown.selectOption({ label });
  }

  /**
   * Selects a tool in the second dropdown.
   * @param label - The visible option text, for example TestNG
   */
  async selectTool(label: string): Promise<void> {
    await this.toolDropdown.selectOption({ label });
  }

  /**
   * Selects a front-end technology in the third dropdown.
   * @param label - The visible option text, for example JQuery
   */
  async selectTechnology(label: string): Promise<void> {
    await this.technologyDropdown.selectOption({ label });
  }

  /**
   * Selects a fruit in the Selected & Disabled dropdown.
   * @param label - The visible option text, for example Pear
   */
  async selectFruit(label: string): Promise<void> {
    await this.fruitDropdown.selectOption({ label });
  }
}
