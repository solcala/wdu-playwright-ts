import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class ContactUsPage extends BasePage {

  readonly path = '/Contact-Us/contactus.html';
  readonly heading: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailAddressField: Locator;
  readonly commentsField: Locator;
  readonly submitButton: Locator;
  readonly resetButton: Locator;
  // Elements displayed after the form is submitted successfully
  readonly successMessage: Locator;
  readonly backToHomePageButton: Locator;
  // Elements displayed if the form is submitted with errors
  readonly errorMessageRequiredFields: Locator;
  readonly errorMessageInvalidEmail: Locator;
  readonly homeButton: Locator;
  readonly tryAgainButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Contact Us' });
    this.firstNameField = page.getByPlaceholder('First Name');
    this.lastNameField = page.getByPlaceholder('Last Name');
    this.emailAddressField = page.getByPlaceholder('Email Address');
    this.commentsField = page.getByPlaceholder('Comments');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.successMessage = page.getByText('Thank You for your Message!');
    this.backToHomePageButton = page.getByRole('link', { name: '← Back to Homepage' });
    this.errorMessageRequiredFields = page.getByText('Error: all fields are required');
    this.errorMessageInvalidEmail = page.getByText('Error: invalid email address');
    this.homeButton = page.getByRole('link', { name: 'Home' });
    this.tryAgainButton = page.getByRole('link', { name: '← Try Again' });

  }
  async fillForm(firstName: string, lastName: string, emailAddress: string, comments: string) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.emailAddressField.fill(emailAddress);
    await this.commentsField.fill(comments);
  }

  async fillFormAndSubmit(firstName: string, lastName: string, emailAddress: string, comments: string) {
    await this.fillForm(firstName, lastName, emailAddress, comments);
    await this.submitButton.click();
  }
  async fillFormAndReset(firstName: string, lastName: string, emailAddress: string, comments: string) {
    await this.fillForm(firstName, lastName, emailAddress, comments);
    await this.resetButton.click();
  }

  async resizeComments(deltaY: number): Promise<{ before: number; after: number }> {
    const beforeBox = await this.commentsField.boundingBox();
    if (!beforeBox) {
      throw new Error('Comments field is not visible');
    }

    const x = beforeBox.x + beforeBox.width - 4;
    const y = beforeBox.y + beforeBox.height - 4;
    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    await this.page.mouse.move(x, y + deltaY, { steps: 8 });
    await this.page.mouse.up();

    const afterBox = await this.commentsField.boundingBox();
    if (!afterBox) {
      throw new Error('Comments field is not visible');
    }

    return { before: beforeBox.height, after: afterBox.height };
  }

}
