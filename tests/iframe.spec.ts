import { test, expect } from '@/fixtures/base-test';

/**
 * The page is one iframe, #frame, around the Page Object Model home.
 * Links have no target, so they navigate the frame. The parent brand link navigates the top window.
 * Contact Us inside the frame is the Contact Us document. This spec does not submit that form.
 * The iframe is 1000px tall. At 1280×720, opening the dialog scrolls the trigger into view
 * and leaves the dialog controls above the window.
 * Frame URLs use expect.poll. toHaveURL() reads page.context(), so it does not apply to a frame.
 */

test.describe('IFrame', () => {
  test.use({ viewport: { width: 1280, height: 1400 } });

  test.beforeEach(async ({ iframePage }) => {
    await iframePage.navigateTo();
  });

  test('find out more opens the welcome dialog', { tag: ['@iframe', '@smoke', '@regression'] }, async ({ iframePage }) => {
    await test.step('Find Out More! opens the welcome dialog', async () => {
      await expect(iframePage.welcomeDialog).toBeHidden();
      await iframePage.openWelcomeDialog();
      await expect(iframePage.welcomeDialog).toBeVisible();
      await expect.soft(iframePage.welcomeDialogTitle).toHaveText('Welcome to webdriveruniversity.com');
      await expect
        .soft(iframePage.welcomeDialog)
        .toContainText(
          'Welcome to webdriveruniversity.com we sell a wide range of electrical goods such as laptops, game consoles, cameras...',
        );
    });

    await test.step('the parent page stays on the IFrame challenge', async () => {
      await expect(iframePage.page).toHaveURL(/\/IFrame\/index\.html$/);
      await expect.poll(() => iframePage.contentUrl()).toMatch(/\/Page-Object-Model\/index\.html$/);
      await expect.soft(iframePage.page).toHaveTitle('WebDriver | IFrame');
    });

    await test.step('Close hides the dialog', async () => {
      await iframePage.closeWelcomeDialog();
      await expect(iframePage.welcomeDialog).toBeHidden();
    });
  });

  test('our products stays inside the frame', { tag: ['@iframe', '@regression'] }, async ({ iframePage }) => {
    await test.step('Our Products loads in the frame', async () => {
      await iframePage.openOurProducts();
      await expect.poll(() => iframePage.contentUrl()).toMatch(/\/Page-Object-Model\/products\.html$/);
      await expect(iframePage.page).toHaveURL(/\/IFrame\/index\.html$/);
      await expect.soft(iframePage.page).toHaveTitle('WebDriver | IFrame');
      await expect.soft(iframePage.specialOffersLink).toBeVisible();
    });
  });

  test('contact us stays inside the frame', { tag: ['@iframe', '@regression'] }, async ({ iframePage }) => {
    await test.step('Contact Us loads in the frame', async () => {
      await iframePage.openContactUs();
      await expect.poll(() => iframePage.contentUrl()).toMatch(/\/Contact-Us\/contactus\.html$/);
      await expect(iframePage.page).toHaveURL(/\/IFrame\/index\.html$/);
      await expect.soft(iframePage.page).toHaveTitle('WebDriver | IFrame');
      await expect.soft(iframePage.contactHeading).toHaveText('CONTACT US');
      await expect.soft(iframePage.firstNameField).toBeVisible();
    });
  });

  test('the parent brand link leaves the iframe page', { tag: ['@iframe', '@regression'] }, async ({ iframePage }) => {
    await test.step('the parent link opens the site home', async () => {
      await iframePage.followTitleLink();
      await expect(iframePage.page).toHaveURL(/^https?:\/\/[^/]+\/index\.html$/);
      await expect(iframePage.frameElement).toHaveCount(0);
      await expect.soft(iframePage.page).toHaveTitle(/WebDriverUniversity/);
    });
  });

  test('the framed brand link stays inside the frame', { tag: ['@iframe', '@regression'] }, async ({ iframePage }) => {
    await test.step('the framed brand loads the site home in the frame', async () => {
      await iframePage.followBrandLink();
      await expect(iframePage.page).toHaveURL(/\/IFrame\/index\.html$/);
      await expect.poll(() => iframePage.contentUrl()).toMatch(/^https?:\/\/[^/]+\/index\.html$/);
      await expect.soft(iframePage.homeHeading).toBeVisible();
      await expect.soft(iframePage.page).toHaveTitle('WebDriver | IFrame');
    });
  });
});
