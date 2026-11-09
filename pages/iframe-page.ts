import { FrameLocator, Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class IframePage extends BasePage {
  readonly path = '/IFrame/index.html';
  readonly frameElement: Locator;
  readonly frame: FrameLocator;
  readonly titleLink: Locator;
  readonly findOutMoreButton: Locator;
  readonly welcomeDialog: Locator;
  readonly welcomeDialogTitle: Locator;
  readonly welcomeDialogCloseButton: Locator;
  readonly ourProductsLink: Locator;
  readonly contactUsLink: Locator;
  readonly specialOffersLink: Locator;
  readonly contactHeading: Locator;
  readonly firstNameField: Locator;
  readonly brandLink: Locator;
  readonly homeHeading: Locator;

  constructor(page: Page) {
    super(page);
    /**
     * The iframe has no name and no title, so the id is the unambiguous locator.
     */
    this.frameElement = page.locator('#frame');
    this.frame = page.frameLocator('#frame');
    this.titleLink = page.getByRole('link', { name: 'WebdriverUniversity.com (IFrame)', exact: true });
    this.findOutMoreButton = this.frame.getByRole('button', { name: 'Find Out More!', exact: true });
    /**
     * The dialog has no accessible name. It is the only dialog in the frame.
     */
    this.welcomeDialog = this.frame.getByRole('dialog');
    this.welcomeDialogTitle = this.welcomeDialog.getByRole('heading', { name: 'Welcome to webdriveruniversity.com' });
    this.welcomeDialogCloseButton = this.welcomeDialog.getByRole('button', { name: 'Close', exact: true });
    this.ourProductsLink = this.frame.getByRole('link', { name: 'Our Products', exact: true });
    this.contactUsLink = this.frame.getByRole('link', { name: 'Contact Us', exact: true });
    this.specialOffersLink = this.frame.getByRole('link', { name: 'Special Offers', exact: true });
    this.contactHeading = this.frame.getByRole('heading', { name: 'CONTACT US', exact: true });
    this.firstNameField = this.frame.getByPlaceholder('First Name', { exact: true });
    /**
     * The brand text changes with the framed page. On the page object model home it is
     * WebdriverUniversity.com (Page Object Model). The id stays nav-title.
     */
    this.brandLink = this.frame.locator('#nav-title');
    /**
     * The site home heading. The framed brand link loads that page inside #frame.
     */
    this.homeHeading = this.frame.getByRole('heading', { name: 'Practise Test Automation on a Real Site', exact: true });
  }

  /**
   * Returns the URL of the document loaded in #frame.
   * The iframe has no name, so the frame is resolved from the #frame element.
   * @returns The frame URL
   */
  async contentUrl(): Promise<string> {
    const handle = await this.frameElement.elementHandle();
    const frame = await handle.contentFrame();
    if (!frame) {
      throw new Error('The #frame iframe has no content document');
    }
    return frame.url();
  }

  /**
   * Clicks Find Out More!. That opens the welcome dialog.
   */
  async openWelcomeDialog(): Promise<void> {
    await this.findOutMoreButton.click();
  }

  /**
   * Clicks Close on the welcome dialog.
   */
  async closeWelcomeDialog(): Promise<void> {
    await this.welcomeDialogCloseButton.click();
  }

  /**
   * Clicks Our Products in the framed menu.
   */
  async openOurProducts(): Promise<void> {
    await this.ourProductsLink.click();
  }

  /**
   * Clicks Contact Us in the framed menu.
   */
  async openContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }

  /**
   * Clicks the parent brand link. That leaves the IFrame page.
   */
  async followTitleLink(): Promise<void> {
    await this.titleLink.click();
  }

  /**
   * Clicks the brand link inside the frame.
   */
  async followBrandLink(): Promise<void> {
    await this.brandLink.click();
  }
}
