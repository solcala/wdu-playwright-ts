import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class ScrollingPage extends BasePage {
  readonly path = '/Scrolling/index.html';
  readonly pageHeading: Locator;
  readonly firstZone: Locator;
  readonly firstZoneLabel: Locator;
  readonly leftEntriesBox: Locator;
  readonly leftEntriesCount: Locator;
  readonly rightEntriesBox: Locator;
  readonly rightEntriesCount: Locator;
  readonly lastZone: Locator;
  readonly lastZoneLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Just Scrolling Around!', exact: true });
    /**
     * The zone has no accessible name. The id is the box the mouseover handler is bound to.
     * The hover replaces the heading with text, so the result is read from the zone.
     */
    this.firstZone = page.locator('#zone1');
    this.firstZoneLabel = this.firstZone.getByRole('heading', { name: 'Scroll to me first!', exact: true });
    /**
     * Both entries headings read 0 Entries, and the text changes, so the name is not the locator.
     * zone2 is the left box. The heading inside it is the count.
     */
    this.leftEntriesBox = page.locator('#zone2');
    this.leftEntriesCount = this.leftEntriesBox.getByRole('heading');
    /**
     * zone3 is the right box. It has its own count. The heading is scoped to this box.
     */
    this.rightEntriesBox = page.locator('#zone3');
    this.rightEntriesCount = this.rightEntriesBox.getByRole('heading');
    /**
     * The zone has no accessible name. The id is the box below the viewport.
     * The hover replaces the heading with text, so the result is read from the zone.
     */
    this.lastZone = page.locator('#zone4');
    this.lastZoneLabel = this.lastZone.getByRole('heading', { name: 'Dont forget to scroll to me!', exact: true });
  }

  /**
   * Moves the pointer onto the first zone. That replaces its text.
   */
  async hoverFirstZone(): Promise<void> {
    await this.firstZone.hover();
  }

  /**
   * Moves the pointer onto the left entries box. Each enter adds one to its count.
   */
  async hoverLeftEntries(): Promise<void> {
    await this.leftEntriesBox.hover();
  }

  /**
   * Moves the pointer onto the right entries box. Each enter adds one to its count.
   */
  async hoverRightEntries(): Promise<void> {
    await this.rightEntriesBox.hover();
  }

  /**
   * Scrolls the last zone into view.
   */
  async scrollLastZoneIntoView(): Promise<void> {
    await this.lastZone.scrollIntoViewIfNeeded();
  }

  /**
   * Returns how far the window has scrolled down.
   * @returns The current window.scrollY in pixels
   */
  async verticalScrollOffset(): Promise<number> {
    return this.page.evaluate(() => window.scrollY);
  }

  /**
   * Moves the pointer onto the last zone. That replaces its text with the pointer position.
   */
  async hoverLastZone(): Promise<void> {
    await this.lastZone.hover();
  }

  /**
   * Moves the pointer onto the page heading, off the zones.
   */
  async hoverPageHeading(): Promise<void> {
    await this.pageHeading.hover();
  }
}
