import { Page } from '@playwright/test';
import { assertBotWallCleared } from '@/support/bot-wall';

export abstract class BasePage {

  readonly page: Page;
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(this.path);
    await assertBotWallCleared(this.page, 12_000);
  }
}
