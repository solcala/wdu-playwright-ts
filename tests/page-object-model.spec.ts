import { test, expect } from '@/fixtures/base-test';

/**
 * Find Out More! opens the welcome dialog. The dialog's own Find Out More button only dismisses it.
 * Our Products opens one offer dialog from every tile. The offer copy is in the document while that dialog is hidden,
 * so the checks wait until the heading or the coupon is visible, and until it is hidden after a dismiss.
 * toHaveText on that copy would pass on the first poll.
 * A dialog click waits until Bootstrap's modal plugin is registered. The title can be ready before that script runs.
 * The carousel timer is stopped before the next-slide check. The case list is specs/page-object-model.plan.md.
 */

test.describe('Page Object Model', { tag: ['@page-object-model'] }, () => {
  test.beforeEach(async ({ pageObjectModelPage }) => {
    await pageObjectModelPage.navigateTo();
  });

  test('find out more opens the welcome dialog', { tag: ['@smoke', '@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('Find Out More! shows the welcome dialog', async () => {
      await pageObjectModelPage.openWelcomeDialog();
      await expect(pageObjectModelPage.welcomeHeading).toBeVisible();
      await expect.soft(pageObjectModelPage.welcomeMessage).toBeVisible();
    });

    await test.step('Close hides the dialog', async () => {
      await pageObjectModelPage.closeWelcomeDialog();
      await expect(pageObjectModelPage.welcomeHeading).toBeHidden();
    });
  });

  test('special offers shows the coupon code', { tag: ['@smoke', '@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('Our Products opens the product list', async () => {
      await pageObjectModelPage.openOurProducts();
      await expect(pageObjectModelPage.page).toHaveURL(/\/Page-Object-Model\/products\.html$/);
    });

    await test.step('Special Offers shows the coupon', async () => {
      await pageObjectModelPage.openSpecialOffers();
      await expect(pageObjectModelPage.offerCode).toBeVisible();
      await expect.soft(pageObjectModelPage.offerHeading).toBeVisible();
      await expect.soft(pageObjectModelPage.offerTerms).toBeVisible();
      await expect.soft(pageObjectModelPage.page).toHaveURL(/\/Page-Object-Model\/products\.html#$/);
    });
  });

  test('our products opens the product list', { tag: ['@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('Our Products loads the catalogue', async () => {
      await pageObjectModelPage.openOurProducts();
      await expect(pageObjectModelPage.page).toHaveURL(/\/Page-Object-Model\/products\.html$/);
      await expect.soft(pageObjectModelPage.page).toHaveTitle('WebDriver (New Approach To Learning)');
      await expect.soft(pageObjectModelPage.specialOffersLink).toBeVisible();
      await expect.soft(pageObjectModelPage.camerasLink).toBeVisible();
    });
  });

  test('cameras shows the special offer', { tag: ['@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('the product list is open', async () => {
      await pageObjectModelPage.openOurProducts();
      await expect(pageObjectModelPage.page).toHaveURL(/\/Page-Object-Model\/products\.html$/);
    });

    await test.step('Cameras shows the offer', async () => {
      await pageObjectModelPage.openCameras();
      await expect(pageObjectModelPage.offerCode).toBeVisible();
      await expect.soft(pageObjectModelPage.offerHeading).toBeVisible();
    });
  });

  test('the next control shows the following slide', { tag: ['@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('the next control advances through the slides and wraps', async () => {
      await pageObjectModelPage.pauseCarousel();
      const first = await pageObjectModelPage.activeSlideSource();
      await pageObjectModelPage.showNextSlide();
      await expect(pageObjectModelPage.activeSlideImage).toHaveAttribute('src', pageObjectModelPage.followingSlideSource(first));

      const second = await pageObjectModelPage.activeSlideSource();
      await pageObjectModelPage.showNextSlide();
      await expect(pageObjectModelPage.activeSlideImage).toHaveAttribute('src', pageObjectModelPage.followingSlideSource(second));

      const third = await pageObjectModelPage.activeSlideSource();
      await pageObjectModelPage.showNextSlide();
      await expect(pageObjectModelPage.activeSlideImage).toHaveAttribute('src', pageObjectModelPage.followingSlideSource(third));
    });
  });

  test('find out more in the dialog stays on the page', { tag: ['@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('the welcome dialog is open', async () => {
      await pageObjectModelPage.openWelcomeDialog();
      await expect(pageObjectModelPage.welcomeHeading).toBeVisible();
    });

    await test.step('Find Out More dismisses the dialog and leaves the page in place', async () => {
      await pageObjectModelPage.dismissWelcomeDialog();
      await expect(pageObjectModelPage.welcomeHeading).toBeHidden();
      await expect(pageObjectModelPage.findOutMoreButton).toBeVisible();
      await expect.soft(pageObjectModelPage.page).toHaveURL(/\/Page-Object-Model\/index\.html$/);
      await expect.soft(pageObjectModelPage.page).toHaveTitle('WebDriver | Page Object Model');
    });
  });

  test('proceed stays on the products page', { tag: ['@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('the offer dialog is open', async () => {
      await pageObjectModelPage.openOurProducts();
      await expect(pageObjectModelPage.page).toHaveURL(/\/Page-Object-Model\/products\.html$/);
      await pageObjectModelPage.openSpecialOffers();
      await expect(pageObjectModelPage.offerCode).toBeVisible();
    });

    await test.step('Proceed dismisses the dialog and leaves the catalogue in place', async () => {
      await pageObjectModelPage.proceedFromOffer();
      await expect(pageObjectModelPage.offerCode).toBeHidden();
      await expect(pageObjectModelPage.specialOffersLink).toBeVisible();
      await expect.soft(pageObjectModelPage.page).toHaveTitle('WebDriver (New Approach To Learning)');
    });
  });

  test('enter opens the welcome dialog', { tag: ['@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('Enter on Find Out More! shows the welcome dialog', async () => {
      await pageObjectModelPage.openWelcomeDialogWithEnter();
      await expect(pageObjectModelPage.welcomeHeading).toBeVisible();
      await expect.soft(pageObjectModelPage.welcomeMessage).toBeVisible();
    });
  });

  test('home returns to the page object model page', { tag: ['@regression'] }, async ({ pageObjectModelPage }) => {
    await test.step('the product list is open', async () => {
      await pageObjectModelPage.openOurProducts();
      await expect(pageObjectModelPage.page).toHaveURL(/\/Page-Object-Model\/products\.html$/);
    });

    await test.step('Home loads this page', async () => {
      await pageObjectModelPage.openHome();
      await expect(pageObjectModelPage.page).toHaveURL(/\/Page-Object-Model\/index\.html$/);
      await expect.soft(pageObjectModelPage.findOutMoreButton).toBeVisible();
      await expect.soft(pageObjectModelPage.page).toHaveTitle('WebDriver | Page Object Model');
    });
  });

  test('contact us opens the contact form', { tag: ['@regression'] }, async ({ pageObjectModelPage, contactUsPage }) => {
    await test.step('Contact Us loads the contact form', async () => {
      await pageObjectModelPage.openContactUs();
      await expect(pageObjectModelPage.page).toHaveURL(/\/Contact-Us\/contactus\.html$/);
      await expect.soft(contactUsPage.heading).toBeVisible();
      await expect.soft(pageObjectModelPage.page).toHaveTitle('WebDriver | Contact Us');
    });
  });
});
