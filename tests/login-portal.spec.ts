import { test, expect } from '@/fixtures/base-test';

/**
 * Automated only what the live page does.
 * `validate()` compares both fields with `==`. It does not trim and it is case-sensitive.
 * Every submit shows an alert, then `validate()` sets `location.href` to `run.html` or `fail.html`.
 * That redirect does not stick: the button is `type="submit"`, and `js/index.js` would call `preventDefault()`, but jQuery never loads.
 * The form GET wins, so the browser stays on `/Login-Portal/index.html?`.
 * Not automated: the jQuery fade never runs, and the Home link is left out because it is not login behavior.
 */

test.describe('Login Portal', () => {

  test.beforeEach(async ({ loginPortalPage }) => {
    await loginPortalPage.navigateTo();
  });

  test.describe('Form validation', () => {

    // The accessible name is the placeholder. There are no labels.
    test('fields show their placeholders', { tag: ['@regression'] }, async ({ loginPortalPage }) => {
      await test.step('username placeholder is Username', async () => {
        await expect.soft(loginPortalPage.usernameField).toHaveAttribute('placeholder', 'Username');
      });

      await test.step('password placeholder is Password', async () => {
        await expect.soft(loginPortalPage.passwordField).toHaveAttribute('placeholder', 'Password');
      });
    });

    // No `required` attributes and no field errors. An empty submit still runs `validate()`.
    test('empty submit shows validation failed', { tag: ['@regression'] }, async ({ loginPortalPage }) => {
      await test.step('accept the validation failed alert', async () => {
        expect(await loginPortalPage.submitLogin()).toBe('validation failed');
      });

      await test.step('stay on the login page', async () => {
        await expect(loginPortalPage.page).toHaveURL(/\/Login-Portal\/index\.html\?/);
      });
    });

  });

  test.describe('Happy path', () => {

    // The only exact match in `validate()`.
    test('valid credentials show validation succeeded', { tag: ['@smoke', '@regression'] }, async ({ loginPortalPage }) => {
      await test.step('fill the matching credentials', async () => {
        await loginPortalPage.fillCredentials('webdriver', 'webdriver123');
      });

      await test.step('accept the validation succeeded alert', async () => {
        expect(await loginPortalPage.submitLogin()).toBe('validation succeeded');
      });

      await test.step('stay on the login page', async () => {
        await expect(loginPortalPage.page).toHaveURL(/\/Login-Portal\/index\.html\?/);
      });
    });

  });

  test.describe('Negative path', () => {

    // A wrong password still reaches `validate()` and takes the else branch.
    test('wrong password shows validation failed', { tag: ['@regression'] }, async ({ loginPortalPage }) => {
      await test.step('fill a wrong password', async () => {
        await loginPortalPage.fillCredentials('webdriver', 'wrong-password');
      });

      await test.step('accept the validation failed alert', async () => {
        expect(await loginPortalPage.submitLogin()).toBe('validation failed');
      });

      await test.step('stay on the login page', async () => {
        await expect(loginPortalPage.page).toHaveURL(/\/Login-Portal\/index\.html\?/);
      });
    });

  });

  test.describe('Edge cases', () => {

    // `==` is case-sensitive. `Webdriver` is not `webdriver`.
    test('username case must match', { tag: ['@regression'] }, async ({ loginPortalPage }) => {
      await test.step('fill a capitalized username', async () => {
        await loginPortalPage.fillCredentials('Webdriver', 'webdriver123');
      });

      await test.step('accept the validation failed alert', async () => {
        expect(await loginPortalPage.submitLogin()).toBe('validation failed');
      });

      await test.step('stay on the login page', async () => {
        await expect(loginPortalPage.page).toHaveURL(/\/Login-Portal\/index\.html\?/);
      });
    });

    // `==` does not trim. A trailing space is a failed login.
    test('username is not trimmed', { tag: ['@regression'] }, async ({ loginPortalPage }) => {
      await test.step('fill a username with a trailing space', async () => {
        await loginPortalPage.fillCredentials('webdriver ', 'webdriver123');
      });

      await test.step('accept the validation failed alert', async () => {
        expect(await loginPortalPage.submitLogin()).toBe('validation failed');
      });

      await test.step('stay on the login page', async () => {
        await expect(loginPortalPage.page).toHaveURL(/\/Login-Portal\/index\.html\?/);
      });
    });

  });

});
