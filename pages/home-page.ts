import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class HomePage extends BasePage {

  readonly path = '/index.html';
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Practise Test Automation on a' });
  }
}
