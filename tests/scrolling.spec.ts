import { test, expect } from '@/fixtures/base-test';

/**
 * The first zone is in view. mouseover replaces its text with Well done for scrolling to me! and sets the font to 24px.
 * There is no mouseout, so that message stays.
 * The entries boxes sit side by side. Each mouseenter adds one to that box only.
 * The last zone starts below the viewport. Scrolling it into view leaves Dont forget to scroll to me!.
 * mouseover then replaces that text with X and Y. The numbers follow the pointer, so the test checks the shape, not the position.
 * The site stylesheet reverts background and color on these boxes, so the script's green and black are not shown.
 * The case list is specs/scrolling.plan.md.
 */

const firstZoneSuccess = 'Well done for scrolling to me!';
const lastZoneStart = 'Dont forget to scroll to me!';
const coordinateText = /^X: \d+Y: \d+$/;

test.describe('Scrolling', { tag: ['@scrolling'] }, () => {
  test.beforeEach(async ({ scrollingPage }) => {
    await scrollingPage.navigateTo();
  });

  test('hovering the first zone shows the success message', { tag: ['@smoke', '@regression'] }, async ({ scrollingPage }) => {
    await test.step('the zone starts as Scroll to me first', async () => {
      await expect(scrollingPage.firstZoneLabel).toHaveText('Scroll to me first!');
    });

    await test.step('the hover replaces that text', async () => {
      await scrollingPage.hoverFirstZone();
      await expect(scrollingPage.firstZone).toHaveText(firstZoneSuccess);
      await expect.soft(scrollingPage.firstZone).toHaveCSS('font-size', '24px');
    });
  });

  test('hovering the last zone shows pointer coordinates', { tag: ['@smoke', '@regression'] }, async ({ scrollingPage }) => {
    await test.step('the zone starts as the scroll reminder', async () => {
      await expect(scrollingPage.lastZoneLabel).toHaveText(lastZoneStart);
    });

    await test.step('the hover replaces that text with coordinates', async () => {
      await scrollingPage.hoverLastZone();
      await expect(scrollingPage.lastZone).toHaveText(coordinateText);
      await expect.soft(scrollingPage.lastZone).toHaveCSS('font-size', '32px');
    });
  });

  test('hovering the left entries box counts one entry', { tag: ['@regression'] }, async ({ scrollingPage }) => {
    await test.step('both boxes start at 0 Entries', async () => {
      await expect(scrollingPage.leftEntriesCount).toHaveText('0 Entries');
      await expect(scrollingPage.rightEntriesCount).toHaveText('0 Entries');
    });

    await test.step('entering the left box counts one', async () => {
      await scrollingPage.hoverLeftEntries();
      await expect(scrollingPage.leftEntriesCount).toHaveText('1 Entries');
      await expect.soft(scrollingPage.rightEntriesCount).toHaveText('0 Entries');
    });
  });

  test('hovering the right entries box counts one entry', { tag: ['@regression'] }, async ({ scrollingPage }) => {
    await test.step('the right box starts at 0 Entries', async () => {
      await expect(scrollingPage.rightEntriesCount).toHaveText('0 Entries');
    });

    await test.step('entering the right box counts one', async () => {
      await scrollingPage.hoverRightEntries();
      await expect(scrollingPage.rightEntriesCount).toHaveText('1 Entries');
      await expect.soft(scrollingPage.leftEntriesCount).toHaveText('0 Entries');
    });
  });

  test('scrolling to the last zone leaves its text', { tag: ['@regression'] }, async ({ scrollingPage }) => {
    await test.step('the zone starts below the viewport', async () => {
      await expect(scrollingPage.lastZoneLabel).toHaveText(lastZoneStart);
      await expect(scrollingPage.lastZone).not.toBeInViewport();
    });

    await test.step('scrolling it into view leaves the text', async () => {
      await scrollingPage.scrollLastZoneIntoView();
      await expect(scrollingPage.lastZone).toBeInViewport();
      await expect(scrollingPage.lastZoneLabel).toHaveText(lastZoneStart);
    });
  });

  test('entering the left entries box again counts another entry', { tag: ['@regression'] }, async ({ scrollingPage }) => {
    await test.step('the first enter counts one', async () => {
      await expect(scrollingPage.leftEntriesCount).toHaveText('0 Entries');
      await scrollingPage.hoverLeftEntries();
      await expect(scrollingPage.leftEntriesCount).toHaveText('1 Entries');
    });

    await test.step('leaving does not clear the count', async () => {
      await scrollingPage.hoverPageHeading();
      await expect(scrollingPage.leftEntriesCount).toHaveText('1 Entries');
    });

    await test.step('entering again counts two', async () => {
      await scrollingPage.hoverLeftEntries();
      await expect(scrollingPage.leftEntriesCount).toHaveText('2 Entries');
      await expect.soft(scrollingPage.rightEntriesCount).toHaveText('0 Entries');
    });
  });

  test('the first zone keeps the success message after the pointer leaves', { tag: ['@regression'] }, async ({ scrollingPage }) => {
    await test.step('the hover shows the success message', async () => {
      await scrollingPage.hoverFirstZone();
      await expect(scrollingPage.firstZone).toHaveText(firstZoneSuccess);
    });

    await test.step('moving the pointer to the heading leaves the message', async () => {
      await scrollingPage.hoverPageHeading();
      await expect(scrollingPage.firstZone).toHaveText(firstZoneSuccess);
      await expect.soft(scrollingPage.firstZone).toHaveCSS('font-size', '24px');
    });
  });
});
