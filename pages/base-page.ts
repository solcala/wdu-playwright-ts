import { Page } from '@playwright/test';

export abstract class BasePage {

  readonly page: Page;
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(this.path);
  }
}
