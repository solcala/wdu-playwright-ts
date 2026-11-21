import { test, expect } from '@/fixtures/base-test';

/**
 * Four buttons each toggle the panel that follows them. Panels start at max-height 0.
 * A click sets that panel's max-height to its scroll height, or clears it. Panels do not close each other.
 * The clipped text still has a box, so toBeVisible does not say whether a panel is open. The open check is max-height.
 * The button also toggles the active class. The closed accessible name ends in a plus, and the open name ends in a minus.
 * `.accordion:hover` sets the header background to #f45950 and does not open the panel.
 * Keep Clicking starts empty. After 10 seconds the panel text is "This text has appeared after 5 seconds!"
 * and the loading line changes from "LOADING.. PLEASE WAIT.." to "LOADING COMPLETE."
 * A click on that line changes no class, style, or text.
 * The button says 5 seconds. The timer is 10. A click before the text arrives stores a max-height of 0,
 * so the text stays clipped until a click that runs after the text is already in the panel.
 * The case list is specs/accordion-items.plan.md.
 */

const openClass = /(?:^|\s)active(?:\s|$)/;

// `.accordion:hover` sets the header background to #f45950.
const hoverBackground = 'rgb(244, 89, 80)';

/**
 * The page uses a 10 second timer. The default assertion timeout is 5 seconds, so the wait for the loading line is longer.
 */
const loadingCompleteTimeout = 20_000;

const loadingWait = 'LOADING.. PLEASE WAIT..';
const loadingComplete = 'LOADING COMPLETE.';
const delayedText = 'This text has appeared after 5 seconds!';
const manualText =
  'Manual testing has for some time been the most popular way to test code. For this method, the tester plays an important role of end user and verifies that all the features of the application work correctly. Manual testing however is on the decline. Companies and developers have realised the efficiency, accuracy and cost savings that is possible by adopting the use of automation testing.';
const cucumberText =
  'Cucumber (BDD) simplifies the requirement capturing process. Requirements can be captured, broken down and simplified effortlessly; making the captured requirements readable to anyone within the organisation and in turn providing the required details and backbone to develop accurate test cases also known as ‘Feature Files’.';
const automationText =
  'Automation testing has been steadily grown in popularity these past few years thanks to the time/ cost savings and efficiency that it offers. Companies throughout the world have or plan to use automation testing to rapidly speed up their test capabilities. Automation test engineers are in great demand and offer an average salary of £45,000+ (2018). Now is a great time to learn about automation test engineering and this course has been carefully developed to slowly introduce you from the basics, all the way to building advanced frameworks.';

test.describe('Accordion Items', { tag: ['@accordion-items'] }, () => {
  test.beforeEach(async ({ accordionItemsPage }) => {
    await accordionItemsPage.navigateTo();
  });

  test('manual testing opens its description', { tag: ['@smoke', '@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('Manual Testing starts closed', async () => {
      await expect(accordionItemsPage.manualTestingPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.manualTestingButton).not.toHaveClass(openClass);
    });

    await test.step('Manual Testing opens on its own', async () => {
      await accordionItemsPage.clickManualTesting();
      await expect(accordionItemsPage.manualTestingPanel).not.toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.manualTestingButton).toHaveClass(openClass);
      await expect.soft(accordionItemsPage.manualTestingPanel).toHaveText(manualText);
      await expect.soft(accordionItemsPage.cucumberBddPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.automationTestingPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.keepClickingPanel).toHaveCSS('max-height', '0px');
    });
  });

  test('cucumber bdd opens its description', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('Cucumber BDD opens its description', async () => {
      await expect(accordionItemsPage.cucumberBddPanel).toHaveCSS('max-height', '0px');
      await accordionItemsPage.clickCucumberBdd();
      await expect(accordionItemsPage.cucumberBddPanel).not.toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.cucumberBddButton).toHaveClass(openClass);
      await expect.soft(accordionItemsPage.cucumberBddPanel).toHaveText(cucumberText);
    });
  });

  test('automation testing opens its description', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('Automation Testing opens its description', async () => {
      await expect(accordionItemsPage.automationTestingPanel).toHaveCSS('max-height', '0px');
      await accordionItemsPage.clickAutomationTesting();
      await expect(accordionItemsPage.automationTestingPanel).not.toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.automationTestingButton).toHaveClass(openClass);
      await expect.soft(accordionItemsPage.automationTestingPanel).toHaveText(automationText);
    });
  });

  test('the delayed text shows after loading completes', { tag: ['@smoke', '@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('the loading line finishes and the panel is still closed', async () => {
      await expect(accordionItemsPage.loadingMessage).toHaveText(loadingComplete, { timeout: loadingCompleteTimeout });
      await expect(accordionItemsPage.keepClickingPanel).toHaveCSS('max-height', '0px');
      await expect(accordionItemsPage.keepClickingPanel).toHaveText(delayedText);
    });

    await test.step('Keep Clicking reveals the text', async () => {
      await accordionItemsPage.clickKeepClicking();
      await expect(accordionItemsPage.keepClickingPanel).not.toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.keepClickingButton).toHaveClass(openClass);
      await expect.soft(accordionItemsPage.keepClickingPanel).toHaveText(delayedText);
    });
  });

  test('the delayed text is absent while loading', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('the page is still on the loading line', async () => {
      await expect(accordionItemsPage.loadingMessage).toHaveText(loadingWait);
      await expect.soft(accordionItemsPage.keepClickingPanel).toHaveText('');
      await expect.soft(accordionItemsPage.keepClickingPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.keepClickingButton).not.toHaveClass(openClass);
    });
  });

  test('hovering a header leaves the panel closed', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('hover leaves Cucumber BDD closed', async () => {
      await accordionItemsPage.hoverCucumberBdd();
      await expect(accordionItemsPage.cucumberBddButton).toHaveCSS('background-color', hoverBackground);
      await expect(accordionItemsPage.cucumberBddPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.cucumberBddButton).not.toHaveClass(openClass);
    });
  });

  test('clicking the loading message leaves the delayed panel closed', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('the loading line is not a header', async () => {
      await accordionItemsPage.clickLoadingMessage();
      await expect(accordionItemsPage.keepClickingPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.keepClickingButton).not.toHaveClass(openClass);
      await expect.soft(accordionItemsPage.loadingMessage).toHaveText(loadingWait);
    });
  });

  test('a second click closes the panel', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('Manual Testing opens', async () => {
      await accordionItemsPage.clickManualTesting();
      await expect(accordionItemsPage.manualTestingPanel).not.toHaveCSS('max-height', '0px');
    });

    await test.step('a second click closes it', async () => {
      await accordionItemsPage.clickManualTesting();
      await expect(accordionItemsPage.manualTestingPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.manualTestingButton).not.toHaveClass(openClass);
      await expect.soft(accordionItemsPage.manualTestingPanel).toHaveText(manualText);
    });
  });

  test('a second panel stays open beside the first', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('Manual Testing opens', async () => {
      await accordionItemsPage.clickManualTesting();
      await expect(accordionItemsPage.manualTestingPanel).not.toHaveCSS('max-height', '0px');
    });

    await test.step('Cucumber BDD opens beside it', async () => {
      await accordionItemsPage.clickCucumberBdd();
      await expect(accordionItemsPage.cucumberBddPanel).not.toHaveCSS('max-height', '0px');
      await expect(accordionItemsPage.manualTestingPanel).not.toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.automationTestingPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.keepClickingPanel).toHaveCSS('max-height', '0px');
    });
  });

  test('an early open leaves the delayed text clipped', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('open Keep Clicking while the panel is empty', async () => {
      await expect(accordionItemsPage.loadingMessage).toHaveText(loadingWait);
      await accordionItemsPage.clickKeepClicking();
      await expect(accordionItemsPage.keepClickingButton).toHaveClass(openClass);
      await expect(accordionItemsPage.keepClickingPanel).toHaveCSS('max-height', '0px');
    });

    await test.step('the text arrives and stays clipped', async () => {
      await expect(accordionItemsPage.loadingMessage).toHaveText(loadingComplete, { timeout: loadingCompleteTimeout });
      await expect(accordionItemsPage.keepClickingPanel).toHaveCSS('max-height', '0px');
      await expect(accordionItemsPage.keepClickingButton).toHaveClass(openClass);
      await expect.soft(accordionItemsPage.keepClickingPanel).toHaveText(delayedText);
    });

    await test.step('the next click closes the panel', async () => {
      await accordionItemsPage.clickKeepClicking();
      await expect(accordionItemsPage.keepClickingButton).not.toHaveClass(openClass);
      await expect(accordionItemsPage.keepClickingPanel).toHaveCSS('max-height', '0px');
    });

    await test.step('a click after the text is in the panel reveals it', async () => {
      await accordionItemsPage.clickKeepClicking();
      await expect(accordionItemsPage.keepClickingPanel).not.toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.keepClickingButton).toHaveClass(openClass);
      await expect.soft(accordionItemsPage.keepClickingPanel).toHaveText(delayedText);
    });
  });

  test('the keyboard toggles Cucumber BDD', { tag: ['@regression'] }, async ({ accordionItemsPage }) => {
    await test.step('Enter opens the panel', async () => {
      await expect(accordionItemsPage.cucumberBddPanel).toHaveCSS('max-height', '0px');
      await accordionItemsPage.pressEnterOnCucumberBdd();
      await expect(accordionItemsPage.cucumberBddPanel).not.toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.cucumberBddButton).toHaveClass(openClass);
      await expect.soft(accordionItemsPage.cucumberBddPanel).toHaveText(cucumberText);
    });

    await test.step('Space closes the panel', async () => {
      await accordionItemsPage.pressSpaceOnCucumberBdd();
      await expect(accordionItemsPage.cucumberBddPanel).toHaveCSS('max-height', '0px');
      await expect.soft(accordionItemsPage.cucumberBddButton).not.toHaveClass(openClass);
      await expect.soft(accordionItemsPage.cucumberBddPanel).toHaveText(cucumberText);
    });
  });
});
