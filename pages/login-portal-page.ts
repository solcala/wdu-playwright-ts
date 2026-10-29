import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class LoginPortalPage extends BasePage {

  readonly path = '/Login-Portal/index.html';
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Fills out the login form with the provided user credentials.
   * @param username - The username entered in the Username field
   * @param password - The password entered in the Password field
   */
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  /**
   * Clicks the login button, intercepts the native JS alert dialog,
   * accepts it, and returns the alert message text.
   * @returns The alert message text
   */
  async submitLogin(): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog');
    const clickPromise = this.loginButton.click();

    const dialog = await dialogPromise;
    const message = dialog.message();

    await dialog.accept();
    await clickPromise;

    return message;
  }
}
