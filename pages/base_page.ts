import { Page, Locator } from '@playwright/test';

export class BasePage {

  readonly page: Page;
  protected readonly path = '/';
  readonly heading: Locator;


  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Practise Test Automation on a' });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(process.env.BASE_URL + this.path);
  }
}
