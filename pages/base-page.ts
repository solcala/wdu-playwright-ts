import { Page, test } from '@playwright/test';

/** Title the site serves to traffic it classifies as a bot (e.g. GitHub Actions runners). */
export const BOT_WALL_TITLE = /Robot Challenge/i;

export abstract class BasePage {

  readonly page: Page;
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(this.path);
    await this.handleBotWall();
  }

  /**
   * If the site shows its bot challenge, give it a chance to auto-resolve,
   * then reload once with a short backoff. If it is still blocked, skip the
   * test with an annotation so CI reports "blocked by bot wall" instead of
   * a false product failure.
   */
  protected async handleBotWall(): Promise<void> {
    if (!BOT_WALL_TITLE.test(await this.page.title())) return;

    const resolved = async (timeout: number): Promise<boolean> =>
      this.page
        .waitForFunction((src) => !new RegExp(src, 'i').test(document.title), BOT_WALL_TITLE.source, { timeout })
        .then(() => true, () => false);

    if (await resolved(10_000)) return;
    await this.page.waitForTimeout(5_000);
    await this.page.reload();
    if (!BOT_WALL_TITLE.test(await this.page.title()) || (await resolved(10_000))) return;

    test.info().annotations.push({
      type: 'bot-wall',
      description: `${this.page.url()} served a "Robot Challenge Screen"; test skipped, not a product failure.`,
    });
    test.skip(true, 'Blocked by site bot wall (Robot Challenge Screen)');
  }
}
