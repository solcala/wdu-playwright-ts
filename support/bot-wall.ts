import { Page } from '@playwright/test';

/** Browser state saved after the site's browser check passes. Gitignored. */
export const SITE_STATE_PATH = 'playwright/.auth/site.json';

/** Title the site serves on its challenge pages (for example "Robot Challenge Screen"). */
export const BOT_WALL_TITLE = /Robot Challenge/i;

export class BotWallError extends Error {
  constructor(url: string) {
    super(`Blocked by the site bot wall at ${url}. This is not a product failure.`);
    this.name = 'BotWallError';
  }
}

/**
 * The challenge is first served at the real URL with an empty or "Loading ..." title,
 * then redirects to /.well-known/sgcaptcha/ (automatic) or /.well-known/captcha/ (manual).
 * The real page is loaded once the URL has left /.well-known/ and the title is a real title.
 */
function waitForRealPage(page: Page, timeout: number): Promise<boolean> {
  return page
    .waitForFunction(
      (wallTitle: string) =>
        !location.pathname.startsWith('/.well-known/') &&
        document.title.trim() !== '' &&
        !/^Loading /i.test(document.title) &&
        !new RegExp(wallTitle, 'i').test(document.title),
      BOT_WALL_TITLE.source,
      { timeout },
    )
    .then(
      () => true,
      () => false,
    );
}

/**
 * Wait for the site's automatic browser check to finish and the real page to load.
 * Reload once if it has not. Throws when the page never leaves the challenge.
 */
export async function assertBotWallCleared(page: Page, timeout = 30_000): Promise<void> {
  if (await waitForRealPage(page, timeout)) return;

  await page.reload();
  if (await waitForRealPage(page, timeout)) return;

  throw new BotWallError(page.url());
}
