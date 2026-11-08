import { test, expect } from '@/fixtures/base-test';

/**
 * Four mouse widgets. The drop stays Dropped! after the box leaves the target.
 * Double click toggles a double class. The resting class is div-double-click, so the check is the separate token.
 * Every hover link alerts the same sentence. Releasing the hold box is what shows the release text.
 * The case list is specs/actions.plan.md.
 */

// div-double-click contains the letters double, so this is the separate token.
const doubleClass = /(?:^|\s)double(?:\s|$)/;
const activatedGreen = 'rgb(16, 185, 129)';
const restingCoral = 'rgb(244, 89, 80)';

test.describe('Actions', () => {
  test.beforeEach(async ({ actionsPage }) => {
    await actionsPage.navigateTo();
  });

  test.describe('Drag and drop', () => {
    test('dragging onto the target shows Dropped', { tag: ['@actions', '@smoke'] }, async ({ actionsPage }) => {
      await test.step('the target starts as DROP HERE!', async () => {
        await expect(actionsPage.droppable).toHaveText('DROP HERE!');
      });

      await test.step('drag the box onto the target', async () => {
        await actionsPage.dragToDropTarget();
      });

      await test.step('the target shows Dropped!', async () => {
        await expect(actionsPage.droppable).toHaveText('Dropped!');
        await expect.soft(actionsPage.droppable).toHaveClass(/ui-state-highlight/);
        await expect.soft(actionsPage.droppableLabel).toHaveCSS('color', activatedGreen);
        await expect.soft(actionsPage.draggable).toHaveClass(/was-dropped/);
        await expect.soft(actionsPage.draggableLabel).toHaveCSS('color', activatedGreen);
      });
    });

    test('a drag that misses the target does not drop', { tag: ['@actions', '@regression'] }, async ({ actionsPage }) => {
      const start = await actionsPage.draggableTop();

      await test.step('drag the box onto the heading', async () => {
        await actionsPage.dragToPageHeading();
      });

      await test.step('the box moved up and the target did not accept it', async () => {
        expect(await actionsPage.draggableTop()).toBeLessThan(start);
        await expect(actionsPage.droppable).toHaveText('DROP HERE!');
        await expect.soft(actionsPage.droppable).not.toHaveClass(/ui-state-highlight/);
        await expect.soft(actionsPage.draggable).not.toHaveClass(/was-dropped/);
      });
    });

    test('a drop stays after the box is dragged off the target', { tag: ['@actions', '@regression'] }, async ({ actionsPage }) => {
      await test.step('drop the box on the target', async () => {
        await actionsPage.dragToDropTarget();
        await expect(actionsPage.droppable).toHaveText('Dropped!');
      });

      const droppedAt = await actionsPage.draggableTop();

      await test.step('drag the box onto the heading', async () => {
        await actionsPage.dragToPageHeading();
      });

      await test.step('the target still shows Dropped!', async () => {
        expect(await actionsPage.draggableTop()).toBeLessThan(droppedAt);
        await expect(actionsPage.droppable).toHaveText('Dropped!');
        await expect.soft(actionsPage.droppable).toHaveClass(/ui-state-highlight/);
      });
    });
  });

  test.describe('Double click', () => {
    test('double click turns the box on', { tag: ['@actions', '@smoke'] }, async ({ actionsPage }) => {
      await test.step('the box starts off', async () => {
        await expect(actionsPage.doubleClickBox).not.toHaveClass(doubleClass);
        await expect(actionsPage.doubleClickHeading).toHaveCSS('color', restingCoral);
      });

      await test.step('double click the box', async () => {
        await actionsPage.doubleClickTheBox();
      });

      await test.step('the heading turns green', async () => {
        await expect(actionsPage.doubleClickBox).toHaveClass(doubleClass);
        await expect(actionsPage.doubleClickHeading).toHaveCSS('color', activatedGreen);
      });
    });

    test('a single click leaves the double click box off', { tag: ['@actions', '@regression'] }, async ({ actionsPage }) => {
      await test.step('click the box once', async () => {
        await actionsPage.clickTheDoubleClickBox();
      });

      await test.step('the box stays off', async () => {
        await expect(actionsPage.doubleClickBox).not.toHaveClass(doubleClass);
        await expect(actionsPage.doubleClickHeading).toHaveCSS('color', restingCoral);
      });
    });

    test('a second double click turns the box off', { tag: ['@actions', '@regression'] }, async ({ actionsPage }) => {
      await test.step('the first double click turns the box on', async () => {
        await actionsPage.doubleClickTheBox();
        await expect(actionsPage.doubleClickBox).toHaveClass(doubleClass);
      });

      await test.step('the second double click turns the box off', async () => {
        await actionsPage.doubleClickTheBox();
        await expect(actionsPage.doubleClickBox).not.toHaveClass(doubleClass);
        await expect(actionsPage.doubleClickHeading).toHaveCSS('color', restingCoral);
      });
    });
  });

  test.describe('Hover', () => {
    test('the first hover link shows the click alert', { tag: ['@actions', '@smoke'] }, async ({ actionsPage }) => {
      const expectedMessage = 'Well done you clicked on the link!';

      await test.step('Link 1 starts hidden', async () => {
        await expect(actionsPage.hoverFirstLink).toBeHidden();
      });

      await test.step('hovering the first menu shows Link 1', async () => {
        await actionsPage.hoverFirstMenu();
        await expect(actionsPage.hoverFirstLink).toBeVisible();
      });

      await test.step('clicking Link 1 shows the alert', async () => {
        expect(await actionsPage.clickFirstMenuLink()).toBe(expectedMessage);
      });
    });

    test('a hover opens only that menu', { tag: ['@actions', '@regression'] }, async ({ actionsPage }) => {
      await test.step('every link starts hidden', async () => {
        await expect(actionsPage.hoverFirstLink).toBeHidden();
        await expect(actionsPage.hoverSecondLink).toBeHidden();
        await expect(actionsPage.hoverThirdLinkOne).toBeHidden();
        await expect(actionsPage.hoverThirdLinkTwo).toBeHidden();
      });

      await test.step('the first menu shows only its link', async () => {
        await actionsPage.hoverFirstMenu();
        await expect(actionsPage.hoverFirstLink).toBeVisible();
        await expect.soft(actionsPage.hoverSecondLink).toBeHidden();
        await expect.soft(actionsPage.hoverThirdLinkOne).toBeHidden();
        await expect.soft(actionsPage.hoverThirdLinkTwo).toBeHidden();
      });

      await test.step('the second menu shows only its link', async () => {
        await actionsPage.hoverSecondMenu();
        await expect(actionsPage.hoverSecondLink).toBeVisible();
        await expect.soft(actionsPage.hoverFirstLink).toBeHidden();
        await expect.soft(actionsPage.hoverThirdLinkOne).toBeHidden();
        await expect.soft(actionsPage.hoverThirdLinkTwo).toBeHidden();
      });

      await test.step('the third menu shows Link 1 and Link 2', async () => {
        await actionsPage.hoverThirdMenu();
        await expect(actionsPage.hoverThirdLinkOne).toBeVisible();
        await expect(actionsPage.hoverThirdLinkTwo).toBeVisible();
        await expect.soft(actionsPage.hoverFirstLink).toBeHidden();
        await expect.soft(actionsPage.hoverSecondLink).toBeHidden();
      });
    });

    test('moving the pointer away hides the open menu', { tag: ['@actions', '@regression'] }, async ({ actionsPage }) => {
      await test.step('the first menu closes', async () => {
        await actionsPage.hoverFirstMenu();
        await expect(actionsPage.hoverFirstLink).toBeVisible();
        await actionsPage.movePointerToPageHeading();
        await expect(actionsPage.hoverFirstLink).toBeHidden();
      });

      await test.step('the second menu closes', async () => {
        await actionsPage.hoverSecondMenu();
        await expect(actionsPage.hoverSecondLink).toBeVisible();
        await actionsPage.movePointerToPageHeading();
        await expect(actionsPage.hoverSecondLink).toBeHidden();
      });

      await test.step('the third menu closes', async () => {
        await actionsPage.hoverThirdMenu();
        await expect(actionsPage.hoverThirdLinkOne).toBeVisible();
        await expect(actionsPage.hoverThirdLinkTwo).toBeVisible();
        await actionsPage.movePointerToPageHeading();
        await expect(actionsPage.hoverThirdLinkOne).toBeHidden();
        await expect(actionsPage.hoverThirdLinkTwo).toBeHidden();
      });
    });

    test('Link 2 shows the click alert', { tag: ['@actions', '@regression'] }, async ({ actionsPage }) => {
      const expectedMessage = 'Well done you clicked on the link!';

      await test.step('click Link 2', async () => {
        expect(await actionsPage.clickThirdMenuLinkTwo()).toBe(expectedMessage);
      });
    });
  });

  test.describe('Click and hold', () => {
    test('pressing then releasing the box shows both messages', { tag: ['@actions', '@smoke'] }, async ({ actionsPage }) => {
      await test.step('the box starts as Click and Hold!', async () => {
        await expect(actionsPage.clickAndHoldBox).toHaveText('Click and Hold!');
      });

      await test.step('holding shows the hold message', async () => {
        await actionsPage.pressClickAndHoldBox();
        await expect(actionsPage.clickAndHoldBox).toHaveText('Well done! keep holding that click now.....');
        await expect(actionsPage.clickAndHoldBox).toHaveCSS('background-color', activatedGreen);
      });

      await test.step('releasing over the box shows the release message', async () => {
        await actionsPage.releasePointer();
        await expect(actionsPage.clickAndHoldBox).toHaveText('Dont release me!!!');
        await expect(actionsPage.clickAndHoldBox).toHaveCSS('background-color', restingCoral);
      });
    });

    test('releasing outside the box keeps the hold message', { tag: ['@actions', '@regression'] }, async ({ actionsPage }) => {
      await test.step('press the box', async () => {
        await actionsPage.pressClickAndHoldBox();
        await expect(actionsPage.clickAndHoldBox).toHaveText('Well done! keep holding that click now.....');
      });

      await test.step('release over the heading', async () => {
        await actionsPage.releasePointerOverPageHeading();
        await expect(actionsPage.clickAndHoldBox).toHaveText('Well done! keep holding that click now.....');
        await expect(actionsPage.clickAndHoldBox).toHaveCSS('background-color', activatedGreen);
      });
    });
  });
});
