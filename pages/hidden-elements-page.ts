import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

type PointerTarget = {
  id: string;
  className: string;
};

export class HiddenElementsPage extends BasePage {
  readonly path = '/Hidden-Elements/index.html';
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
   * The pointer goes to the element underneath the section's box.
   * @returns The id and class of the element under that point before the click
   */
  async clickVisibilityHiddenSection(): Promise<PointerTarget> {
    const box = await this.visibilityHiddenSection.boundingBox();
    if (!box) {
      throw new Error('The visibility-hidden section has no layout box');
    }

    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const hit = await this.page.evaluate(
      ({ x, y }) => {
        const element = document.elementFromPoint(x, y);
        if (!(element instanceof HTMLElement)) {
          return { id: '', className: '' };
        }
        return { id: element.id, className: element.className };
      },
      { x, y },
    );
    await this.page.mouse.click(x, y);
    return hit;
  }
}
