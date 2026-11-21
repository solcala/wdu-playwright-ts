import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

type PointerClick = {
  id: string;
  hasThumbnailClass: boolean;
};

type ClickRecordWindow = Window & {
  visibilityHiddenClick?: PointerClick;
};

export class HiddenElementsPage extends BasePage {
  readonly path = '/Hidden-Elements/index.html';
  readonly body: Locator;
  readonly notDisplayedHeading: Locator;
  readonly notDisplayedSection: Locator;
  readonly notDisplayedControl: Locator;
  readonly notDisplayedModal: Locator;
  readonly visibilityHiddenHeading: Locator;
  readonly visibilityHiddenSection: Locator;
  readonly visibilityHiddenControl: Locator;
  readonly visibilityHiddenModal: Locator;
  readonly zeroOpacitySection: Locator;
  readonly zeroOpacityControl: Locator;
  readonly zeroOpacityModal: Locator;
  readonly zeroOpacityModalTitle: Locator;
  readonly zeroOpacityModalCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * Bootstrap adds modal-open here when a modal opens. Body has no accessible name.
     */
    this.body = page.locator('body');
    this.notDisplayedHeading = page.getByRole('heading', { name: 'Not Displayed', exact: true });
    /**
     * The section has no accessible name. The id is the display:none rule.
     */
    this.notDisplayedSection = page.locator('#not-displayed');
    /**
     * The control is a span, so it has no button role.
     * The other labels start with the same words, so the match is exact.
     */
    this.notDisplayedControl = page.getByText('CLICK ME!', { exact: true });
    /**
     * The modal uses role="dialog" and has no accessible name.
     * It stays in the page when it is hidden, so the id is the locator.
     */
    this.notDisplayedModal = page.locator('#myModalClick');
    this.visibilityHiddenHeading = page.getByRole('heading', { name: 'Visibility Hidden', exact: true });
    /**
     * The section has no accessible name. The id is the visibility:hidden rule.
     */
    this.visibilityHiddenSection = page.locator('#visibility-hidden');
    this.visibilityHiddenControl = page.getByText('CLICK ME!!', { exact: true });
    this.visibilityHiddenModal = page.locator('#myModalJSClick');
    /**
     * The section has no accessible name. The id is the opacity:0 rule.
     * The control's own opacity stays 1. The section is what makes the label impossible to see.
     */
    this.zeroOpacitySection = page.locator('#zero-opacity');
    this.zeroOpacityControl = page.getByText('CLICK ME!!!', { exact: true });
    this.zeroOpacityModal = page.locator('#myModalMoveClick');
    this.zeroOpacityModalTitle = this.zeroOpacityModal.getByRole('heading');
    this.zeroOpacityModalCloseButton = this.zeroOpacityModal.getByRole('button', { name: 'Close', exact: true });
  }

  /**
   * Clicks CLICK ME!!!. That opens the zero-opacity modal.
   */
  async clickZeroOpacityControl(): Promise<void> {
    await this.zeroOpacityControl.click();
  }

  /**
   * Clicks Close on the zero-opacity modal.
   */
  async closeZeroOpacityModal(): Promise<void> {
    await this.zeroOpacityModalCloseButton.click();
  }

  /**
   * Clicks the center of the visibility-hidden section.
   * The section is not a hit target, so locator.click would wait until it is visible.
   * visibility:hidden still has a layout box, so the wait is for that box, not Playwright's visible state.
   * The listener is registered before the pointer click, because the event is gone if nothing is listening.
   * @returns The id of the element that received the click, and whether that element has the thumbnail class
   */
  async clickVisibilityHiddenSection(): Promise<PointerClick> {
    await this.visibilityHiddenSection.waitFor({ state: 'attached' });
    /**
     * The id is the visibility:hidden section. Playwright's visible state does not match this rule.
     */
    await this.page.waitForFunction(() => {
      const section = document.getElementById('visibility-hidden');
      if (!section) {
        return false;
      }
      const box = section.getBoundingClientRect();
      return box.width > 0 && box.height > 0;
    });

    const box = await this.visibilityHiddenSection.boundingBox();
    if (!box) {
      throw new Error('The visibility-hidden section has no layout box');
    }

    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await this.page.evaluate(() => {
      const view = window as ClickRecordWindow;
      document.addEventListener(
        'click',
        (event) => {
          const element = event.target instanceof HTMLElement ? event.target : null;
          view.visibilityHiddenClick = {
            id: element?.id ?? '',
            hasThumbnailClass: element?.classList.contains('thumbnail') ?? false,
          };
        },
        { capture: true, once: true },
      );
    });
    await this.page.mouse.click(x, y);
    await this.page.waitForFunction(() => (window as ClickRecordWindow).visibilityHiddenClick !== undefined);
    return this.page.evaluate(() => {
      const view = window as ClickRecordWindow;
      const hit = view.visibilityHiddenClick;
      delete view.visibilityHiddenClick;
      if (!hit) {
        throw new Error('The click listener did not run');
      }
      return hit;
    });
  }
}
