import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

type CarouselPlugin = {
  pause: () => void;
  paused: boolean;
};

type JQueryWithCarousel = (element: Element) => {
  data: (key: string) => CarouselPlugin | undefined;
};

export class PageObjectModelPage extends BasePage {
  readonly path = '/Page-Object-Model/index.html';
  readonly findOutMoreButton: Locator;
  readonly welcomeDialog: Locator;
  readonly welcomeHeading: Locator;
  readonly welcomeMessage: Locator;
  readonly welcomeDialogFindOutMoreButton: Locator;
  readonly welcomeDialogCloseButton: Locator;
  readonly ourProductsLink: Locator;
  readonly homeLink: Locator;
  readonly contactUsLink: Locator;
  readonly specialOffersLink: Locator;
  readonly camerasLink: Locator;
  readonly offerDialog: Locator;
  readonly offerHeading: Locator;
  readonly offerCode: Locator;
  readonly offerTerms: Locator;
  readonly proceedButton: Locator;
  readonly nextSlideControl: Locator;
  readonly activeSlideImage: Locator;

  constructor(page: Page) {
    super(page);
    this.findOutMoreButton = page.getByRole('button', { name: 'Find Out More!', exact: true });
    /**
     * The dialog has no accessible name. It stays in the document while it is hidden, so the id is the locator.
     * The home document and the products document each have their own #myModal.
     */
    this.welcomeDialog = page.locator('#myModal');
    this.welcomeHeading = this.welcomeDialog.getByRole('heading', { name: 'Welcome to webdriveruniversity.com', exact: true });
    this.welcomeMessage = this.welcomeDialog.getByText(
      'Welcome to webdriveruniversity.com we sell a wide range of electrical goods such as laptops, game consoles, cameras...',
      { exact: true },
    );
    /**
     * The page button is Find Out More! and this one is Find Out More. The match is exact so the two stay apart.
     */
    this.welcomeDialogFindOutMoreButton = this.welcomeDialog.getByRole('button', { name: 'Find Out More', exact: true });
    this.welcomeDialogCloseButton = this.welcomeDialog.getByRole('button', { name: 'Close', exact: true });
    this.ourProductsLink = page.getByRole('link', { name: 'Our Products', exact: true });
    this.homeLink = page.getByRole('link', { name: 'Home', exact: true });
    this.contactUsLink = page.getByRole('link', { name: 'Contact Us', exact: true });
    this.specialOffersLink = page.getByRole('link', { name: 'Special Offers', exact: true });
    this.camerasLink = page.getByRole('link', { name: 'Cameras', exact: true });
    /**
     * The products dialog is the same id on that document. The offer copy is in the document while the dialog is hidden.
     */
    this.offerDialog = page.locator('#myModal');
    this.offerHeading = this.offerDialog.getByRole('heading', {
      name: 'SPECIAL OFFER! - GET 30% OFF YOUR FIRST ORDER AT WEBDRIVERUNIVERSITY.COM',
      exact: true,
    });
    this.offerCode = this.offerDialog.getByText('NEWCUSTOMER773322', { exact: true });
    /**
     * The £50 rule is one phrase inside the offer paragraph, so the match is not the whole paragraph.
     */
    this.offerTerms = this.offerDialog.getByText('over the value of £50');
    this.proceedButton = this.offerDialog.getByRole('button', { name: 'Proceed', exact: true });
    /**
     * The next control has no accessible name. data-slide="next" is the control.
     */
    this.nextSlideControl = page.locator('[data-slide="next"]');
    /**
     * The slide image has an empty alt, and the first two slides share an id.
     * The active class is the slide the carousel is showing. The id is the carousel.
     */
    this.activeSlideImage = page.locator('#carousel-example-generic .item.active img');
  }

  /**
   * Opens the page and waits until Bootstrap's modal plugin is registered.
   * The page title can be set before the scripts at the end of the document run, and a dialog click does nothing until then.
   */
  async navigateTo(): Promise<void> {
    await super.navigateTo();
    await this.waitForModalPlugin();
  }

  /**
   * Waits until Bootstrap's modal plugin is registered.
   */
  private async waitForModalPlugin(): Promise<void> {
    await this.page.waitForFunction(() => {
      const jquery = (window as Window & { jQuery?: { fn?: { modal?: unknown } } }).jQuery;
      return typeof jquery?.fn?.modal === 'function';
    });
  }

  /**
   * Clicks Find Out More!. That opens the welcome dialog.
   */
  async openWelcomeDialog(): Promise<void> {
    await this.waitForModalPlugin();
    await this.findOutMoreButton.click();
  }

  /**
   * Clicks Close on the welcome dialog.
   */
  async closeWelcomeDialog(): Promise<void> {
    await this.welcomeDialogCloseButton.click();
  }

  /**
   * Clicks Find Out More on the welcome dialog. That dismisses the dialog.
   */
  async dismissWelcomeDialog(): Promise<void> {
    await this.welcomeDialogFindOutMoreButton.click();
  }

  /**
   * Focuses Find Out More! and presses Enter. That opens the welcome dialog.
   */
  async openWelcomeDialogWithEnter(): Promise<void> {
    await this.waitForModalPlugin();
    await this.findOutMoreButton.focus();
    await this.page.keyboard.press('Enter');
  }

  /**
   * Clicks Our Products.
   */
  async openOurProducts(): Promise<void> {
    await this.ourProductsLink.click();
  }

  /**
   * Clicks Home in the menu.
   */
  async openHome(): Promise<void> {
    await this.homeLink.click();
  }

  /**
   * Clicks Contact Us.
   */
  async openContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }

  /**
   * Clicks Special Offers. That opens the offer dialog.
   */
  async openSpecialOffers(): Promise<void> {
    await this.waitForModalPlugin();
    await this.specialOffersLink.click();
  }

  /**
   * Clicks Cameras. That opens the offer dialog.
   */
  async openCameras(): Promise<void> {
    await this.waitForModalPlugin();
    await this.camerasLink.click();
  }

  /**
   * Clicks Proceed. That dismisses the offer dialog.
   */
  async proceedFromOffer(): Promise<void> {
    await this.proceedButton.click();
  }

  /**
   * Stops the carousel timer.
   * The slides advance on their own about every 5 seconds, which races a check of one slide.
   * Hovering the carousel did not keep the current slide still. The wait is for the plugin to report paused.
   */
  async pauseCarousel(): Promise<void> {
    await this.page.waitForFunction(() => {
      const carousel = document.querySelector('#carousel-example-generic');
      const jquery = (window as Window & { jQuery?: JQueryWithCarousel }).jQuery;
      if (!carousel || typeof jquery !== 'function') {
        return false;
      }
      const plugin = jquery(carousel).data('bs.carousel');
      if (!plugin) {
        return false;
      }
      plugin.pause();
      return plugin.paused === true;
    });
  }

  /**
   * Returns the src of the image in the current slide.
   * @returns The image src attribute
   */
  async activeSlideSource(): Promise<string> {
    const source = await this.activeSlideImage.getAttribute('src');
    if (!source) {
      throw new Error('The active slide has no image source');
    }
    return source;
  }

  /**
   * Clicks the next control. That shows the following slide.
   */
  async showNextSlide(): Promise<void> {
    await this.nextSlideControl.click();
  }

  /**
   * Returns the slide that follows this one. The last slide wraps to the first.
   * @param source - The src of the slide that is active now
   * @returns The src of the following slide
   */
  followingSlideSource(source: string): string {
    const slideSources = ['../img/amp.svg', '../img/boombox.svg', '../img/nintendo.svg'];
    const index = slideSources.indexOf(source);
    if (index < 0) {
      throw new Error(`The active slide source is not one of the carousel images: ${source}`);
    }
    return slideSources[(index + 1) % slideSources.length];
  }
}
