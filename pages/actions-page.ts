import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class ActionsPage extends BasePage {
  readonly path = '/Actions/index.html';
  readonly pageHeading: Locator;
  readonly draggable: Locator;
  readonly draggableLabel: Locator;
  readonly droppable: Locator;
  readonly droppableLabel: Locator;
  readonly doubleClickBox: Locator;
  readonly doubleClickHeading: Locator;
  readonly hoverFirstButton: Locator;
  readonly hoverSecondButton: Locator;
  readonly hoverThirdButton: Locator;
  readonly hoverFirstLink: Locator;
  readonly hoverSecondLink: Locator;
  readonly hoverThirdLinkOne: Locator;
  readonly hoverThirdLinkTwo: Locator;
  readonly clickAndHoldBox: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'The Key to Success is to take massive ACTION!' });
    /**
     * The drag source, drop target, double-click box, and click-and-hold box are divs.
     * None of them has an accessible role. Each id is unique.
     * div-drag-drop-thumbnail is on two elements, so it is not used.
     */
    this.draggable = page.locator('#draggable');
    this.draggableLabel = this.draggable.locator('p');
    this.droppable = page.locator('#droppable');
    /**
     * The message is the only paragraph in the target. Its text changes, so it is not found by text.
     */
    this.droppableLabel = this.droppable.locator('p');
    this.doubleClickBox = page.locator('#double-click');
    this.doubleClickHeading = this.doubleClickBox.getByRole('heading', { name: 'Double Click Me!' });
    this.hoverFirstButton = page.getByRole('button', { name: 'Hover Over Me First!', exact: true });
    this.hoverSecondButton = page.getByRole('button', { name: 'Hover Over Me Second!', exact: true });
    this.hoverThirdButton = page.getByRole('button', { name: 'Hover Over Me Third!', exact: true });
    /**
     * Link 1 is in every menu, and each link is display:none until that menu is hovered.
     * The menu is the button's parent: it has no id and no accessible name, so menuLink uses the XPath parent step.
     * includeHidden keeps the hidden link matchable.
     */
    this.hoverFirstLink = this.menuLink(this.hoverFirstButton, 'Link 1');
    this.hoverSecondLink = this.menuLink(this.hoverSecondButton, 'Link 1');
    this.hoverThirdLinkOne = this.menuLink(this.hoverThirdButton, 'Link 1');
    this.hoverThirdLinkTwo = this.menuLink(this.hoverThirdButton, 'Link 2');
    this.clickAndHoldBox = page.locator('#click-box');
  }

  /**
   * Finds one menu link from the button that owns that menu.
   * @param button - The hover button for the menu
   * @param name - The link text, Link 1 or Link 2
   * @returns The link, including while it is hidden
   */
  private menuLink(button: Locator, name: string): Locator {
    return button.locator('..').getByRole('link', { name, exact: true, includeHidden: true });
  }

  /**
   * Drags the source box onto the drop target.
   */
  async dragToDropTarget(): Promise<void> {
    await this.draggable.dragTo(this.droppable);
  }

  /**
   * Drags the source box onto the page heading, above the drop target.
   */
  async dragToPageHeading(): Promise<void> {
    await this.draggable.dragTo(this.pageHeading);
  }

  /**
   * Returns the top of the source box.
   * @returns The y coordinate of the draggable
   */
  async draggableTop(): Promise<number> {
    const box = await this.draggable.boundingBox();
    if (!box) {
      throw new Error('The draggable has no layout box.');
    }
    return box.y;
  }

  /**
   * Double-clicks the double-click box. That toggles its double class.
   */
  async doubleClickTheBox(): Promise<void> {
    await this.doubleClickBox.dblclick();
  }

  /**
   * Clicks the double-click box once.
   */
  async clickTheDoubleClickBox(): Promise<void> {
    await this.doubleClickBox.click();
  }

  /**
   * Moves the pointer onto the first hover button. That opens its menu.
   */
  async hoverFirstMenu(): Promise<void> {
    await this.hoverFirstButton.hover();
  }

  /**
   * Moves the pointer onto the second hover button. That opens its menu.
   */
  async hoverSecondMenu(): Promise<void> {
    await this.hoverSecondButton.hover();
  }

  /**
   * Moves the pointer onto the third hover button. That opens its menu.
   */
  async hoverThirdMenu(): Promise<void> {
    await this.hoverThirdButton.hover();
  }

  /**
   * Moves the pointer onto the page heading. An open hover menu closes.
   */
  async movePointerToPageHeading(): Promise<void> {
    await this.pageHeading.hover();
  }

  /**
   * Hovers the first menu and clicks Link 1. That opens an alert.
   * @returns The alert message text
   */
  async clickFirstMenuLink(): Promise<string> {
    await this.hoverFirstMenu();
    return this.acceptLinkAlert(this.hoverFirstLink);
  }

  /**
   * Hovers the third menu and clicks Link 2. That opens an alert.
   * @returns The alert message text
   */
  async clickThirdMenuLinkTwo(): Promise<string> {
    await this.hoverThirdMenu();
    return this.acceptLinkAlert(this.hoverThirdLinkTwo);
  }

  /**
   * Clicks a hover link and accepts the alert it opens.
   * The listener is registered before the click, because the alert is gone if nothing is listening.
   * @param link - The menu link that opens the alert
   * @returns The alert message text
   */
  private async acceptLinkAlert(link: Locator): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog');
    const clickPromise = link.click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    await clickPromise;
    return message;
  }

  /**
   * Presses the pointer down on the click-and-hold box and leaves it down.
   */
  async pressClickAndHoldBox(): Promise<void> {
    await this.clickAndHoldBox.hover();
    await this.page.mouse.down();
  }

  /**
   * Releases the pointer where it already is.
   */
  async releasePointer(): Promise<void> {
    await this.page.mouse.up();
  }

  /**
   * Moves the pointer to the page heading and releases it there.
   */
  async releasePointerOverPageHeading(): Promise<void> {
    await this.pageHeading.hover();
    await this.page.mouse.up();
  }
}
