import { test, expect } from '@/fixtures/base-test';

/**
 * Not Displayed is display:none and has no box. Visibility Hidden keeps its box and ignores the pointer.
 * Zero Opacity keeps its box, and a normal click still opens that modal. The click does not change the opacity.
 * The spans are not in the tab order. js/script.js is wrapped in a script tag, so the jQuery dialog stays hidden.
 * The case list is specs/hidden-elements.plan.md.
 */

/**
 * .section-title sets height to 70px. display:none drops that box. The other two rules keep it.
 */
const sectionHeight = 70;
/**
 * Bootstrap shows the dialog after the backdrop fade.
 * A hidden check before that fade ends still passes when the click opened the modal.
 */
const modalFadeWindowMs = 1_000;
const zeroOpacityModalTitle = 'Well done! the Action Move & Click can become very useful!';
const zeroOpacityModalBody =
  'Advanced user interactions (API) has been developed to enable you to perform more complex interactions such as:';

test.describe('Hidden Elements', { tag: ['@hidden-elements'] }, () => {
  test.beforeEach(async ({ hiddenElementsPage }) => {
    await hiddenElementsPage.navigateTo();
  });

  test('clicking the zero-opacity control shows its modal', { tag: ['@smoke', '@regression'] }, async ({ hiddenElementsPage }) => {
    await test.step('the control is transparent and still clickable', async () => {
      await expect(hiddenElementsPage.zeroOpacitySection).toHaveCSS('opacity', '0');
      await expect(hiddenElementsPage.zeroOpacityControl).toBeVisible();
      await expect(hiddenElementsPage.zeroOpacityModal).toBeHidden();
    });

    await test.step('the click opens that modal', async () => {
      await hiddenElementsPage.clickZeroOpacityControl();
      await expect(hiddenElementsPage.zeroOpacityModal).toBeVisible();
      await expect.soft(hiddenElementsPage.zeroOpacityModalTitle).toHaveText(zeroOpacityModalTitle);
      await expect.soft(hiddenElementsPage.zeroOpacityModal).toContainText(zeroOpacityModalBody);
      await expect.soft(hiddenElementsPage.zeroOpacitySection).toHaveCSS('opacity', '0');
    });
  });

  test('the not-displayed control is not shown', { tag: ['@regression'] }, async ({ hiddenElementsPage }) => {
    await test.step('the heading is shown and the control is not displayed', async () => {
      await expect(hiddenElementsPage.notDisplayedHeading).toBeVisible();
      await expect(hiddenElementsPage.notDisplayedControl).toBeAttached();
      await expect(hiddenElementsPage.notDisplayedControl).toBeHidden();
      await expect(hiddenElementsPage.notDisplayedSection).toHaveCSS('display', 'none');
      await expect(hiddenElementsPage.notDisplayedModal).toBeHidden();
    });
  });

  test('a click on the visibility-hidden section does not open its modal', { tag: ['@regression'] }, async ({ hiddenElementsPage }) => {
    await test.step('the control is visibility hidden', async () => {
      await expect(hiddenElementsPage.visibilityHiddenHeading).toBeVisible();
      await expect(hiddenElementsPage.visibilityHiddenControl).toBeAttached();
      await expect(hiddenElementsPage.visibilityHiddenControl).toBeHidden();
      await expect(hiddenElementsPage.visibilityHiddenSection).toHaveCSS('visibility', 'hidden');
      await expect(hiddenElementsPage.visibilityHiddenModal).toBeHidden();
    });

    await test.step('a pointer click in that section misses the control', async () => {
      const hit = await hiddenElementsPage.clickVisibilityHiddenSection();
      expect(hit.id).toBe('');
      expect(hit.hasThumbnailClass).toBe(true);
      /**
       * The click listener has already run. The modal check covers the backdrop fade.
       * toBeHidden() would pass on the first poll, while Bootstrap still has the dialog hidden.
       */
      expect(await hiddenElementsPage.visibilityHiddenModalOpened(modalFadeWindowMs)).toBe(false);
      await expect.soft(hiddenElementsPage.notDisplayedModal).toBeHidden();
      await expect.soft(hiddenElementsPage.zeroOpacityModal).toBeHidden();
    });
  });

  test(
    'not displayed takes no space and the other sections keep their height',
    { tag: ['@regression'] },
    async ({ hiddenElementsPage }) => {
      await test.step('only the displayed sections keep the 70px box', async () => {
        const notDisplayed = await hiddenElementsPage.notDisplayedSection.boundingBox();
        const visibilityHidden = await hiddenElementsPage.visibilityHiddenSection.boundingBox();
        const zeroOpacity = await hiddenElementsPage.zeroOpacitySection.boundingBox();
        expect.soft(notDisplayed).toBeNull();
        expect.soft(visibilityHidden).not.toBeNull();
        expect.soft(visibilityHidden?.height).toBe(sectionHeight);
        expect.soft(zeroOpacity).not.toBeNull();
        expect.soft(zeroOpacity?.height).toBe(sectionHeight);
      });
    },
  );

  test('the zero-opacity control opens its modal again', { tag: ['@regression'] }, async ({ hiddenElementsPage }) => {
    await test.step('Close hides the modal', async () => {
      await hiddenElementsPage.clickZeroOpacityControl();
      await expect(hiddenElementsPage.zeroOpacityModal).toBeVisible();
      await hiddenElementsPage.closeZeroOpacityModal();
      await expect(hiddenElementsPage.zeroOpacityModal).toBeHidden();
    });

    await test.step('the control is still transparent and opens the modal again', async () => {
      await expect(hiddenElementsPage.zeroOpacitySection).toHaveCSS('opacity', '0');
      await hiddenElementsPage.clickZeroOpacityControl();
      await expect(hiddenElementsPage.zeroOpacityModal).toBeVisible();
    });
  });
});
