import { test, expect } from '@/fixtures/base-test';

/**
 * Basics A on AI Testing Playground: Dynamic Selectors, Flaky Loader, Multi-Step Form,
 * Auto-Dismiss Toast, and Re-Enable Delay.
 * The login classes change on each load. Any non-empty username and password, after trim, is accepted.
 * The loader waits 3 to 8 seconds. The toast fades with opacity and stays in the page.
 * The re-enable button disables on click and is enabled again about 3 seconds later.
 * The case list is specs/ai-playground-basics-a.plan.md.
 */

/**
 * The loader waits 3 to 8 seconds. The default assertion timeout is 5 seconds,
 * so the visibility check waits longer for the content.
 */
const flakyContentTimeout = 15_000;

const toastShownClass = /(?:^|\s)show(?:\s|$)/;

const reEnablingStatus = /^Re-enabling in [123]s…$/;

test.describe('AI Testing Playground', { tag: ['@ai-playground', '@ai-playground-basics-a'] }, () => {
  test.beforeEach(async ({ aiTestingPlaygroundPage }) => {
    await aiTestingPlaygroundPage.navigateTo();
  });

  test.describe('Dynamic Selectors', () => {
    test('a completed login shows login successful', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Login shows the success line', async () => {
        await aiTestingPlaygroundPage.logIn('ada', 'secret');
        await expect(aiTestingPlaygroundPage.dynamicSuccessMessage).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.dynamicErrorMessage).toBeHidden();
      });
    });

    test('an empty login shows invalid credentials', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Login shows the error line', async () => {
        await aiTestingPlaygroundPage.logIn('', '');
        await expect(aiTestingPlaygroundPage.dynamicErrorMessage).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.dynamicSuccessMessage).toBeHidden();
      });
    });

    test('a missing password shows invalid credentials', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('a username on its own is rejected', async () => {
        await aiTestingPlaygroundPage.logIn('ada', '');
        await expect(aiTestingPlaygroundPage.dynamicErrorMessage).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.dynamicSuccessMessage).toBeHidden();
      });
    });

    test('whitespace-only fields show invalid credentials', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('spaces are trimmed and the login is rejected', async () => {
        await aiTestingPlaygroundPage.logIn('   ', '   ');
        await expect(aiTestingPlaygroundPage.dynamicErrorMessage).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.dynamicSuccessMessage).toBeHidden();
      });
    });

    test('spaces around the credentials still log in', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('trimmed values are accepted and the fields keep the spaces', async () => {
        await aiTestingPlaygroundPage.logIn('  ada  ', '  secret  ');
        await expect(aiTestingPlaygroundPage.dynamicSuccessMessage).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.dynamicErrorMessage).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.dynamicUsernameField).toHaveValue('  ada  ');
        await expect.soft(aiTestingPlaygroundPage.dynamicPasswordField).toHaveValue('  secret  ');
      });
    });
  });

  test.describe('Flaky Loader', () => {
    test('loading the content shows the success message', { tag: ['@smoke', '@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the content appears', async () => {
        await aiTestingPlaygroundPage.loadFlakyContent();
        /**
         * The sentence is already in the page, so a text check would pass on the first poll while the line is hidden.
         */
        await expect(aiTestingPlaygroundPage.flakySuccessMessage).toBeVisible({ timeout: flakyContentTimeout });
        await expect.soft(aiTestingPlaygroundPage.flakyLoadingMessage).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.flakyActionButton).toBeVisible();
      });
    });

    test('the content stays hidden before the load', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the success line and the loading line are hidden', async () => {
        /**
         * This test does not click. A hidden check after the click would pass on the first poll
         * during the delay, and the test would finish before the content appeared.
         */
        await expect(aiTestingPlaygroundPage.flakySuccessMessage).toBeAttached();
        await expect(aiTestingPlaygroundPage.flakySuccessMessage).toBeHidden();
        await expect(aiTestingPlaygroundPage.flakyLoadingMessage).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.flakyLoadButton).toBeEnabled();
      });
    });

    test('the loaded action shows its toast and the toast dismisses', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the content is shown', async () => {
        await aiTestingPlaygroundPage.loadFlakyContent();
        await expect(aiTestingPlaygroundPage.flakySuccessMessage).toBeVisible({ timeout: flakyContentTimeout });
      });

      await test.step('Click Me Now shows its toast and the toast fades out', async () => {
        await aiTestingPlaygroundPage.clickFlakyAction();
        /**
         * The text is set in the click. Opacity fades in, so the opacity check is the wait.
         * toBeVisible() ignores opacity.
         */
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '1');
        await expect(aiTestingPlaygroundPage.toast).toHaveText('Flaky button clicked!');
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '0');
      });
    });
  });

  test.describe('Multi-Step Form', () => {
    test('a completed form shows the success message', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the name step accepts a full name and an email', async () => {
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 1 of 3');
        await aiTestingPlaygroundPage.fillNameStep('Jane Doe', 'jane@example.com');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 2 of 3');
        await expect.soft(aiTestingPlaygroundPage.nameStep).toBeHidden();
      });

      await test.step('the country step accepts an empty phone', async () => {
        await aiTestingPlaygroundPage.fillCountryStep('United Kingdom', '');
        await expect.soft(aiTestingPlaygroundPage.countryDropdown).toHaveValue('UK');
        await expect.soft(aiTestingPlaygroundPage.phoneField).toHaveValue('');
        await aiTestingPlaygroundPage.continueFromCountryStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 3 of 3');
      });

      await test.step('accepting the terms submits the form', async () => {
        await expect.soft(aiTestingPlaygroundPage.commentsField).toHaveValue('');
        await aiTestingPlaygroundPage.acceptTerms();
        await aiTestingPlaygroundPage.submitMultiStepForm();
        await expect(aiTestingPlaygroundPage.multiStepSuccessMessage).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.stepIndicator).toHaveText('');
        await expect.soft(aiTestingPlaygroundPage.termsStep).toBeHidden();
      });
    });

    test('an empty first step shows both errors', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('both errors are shown and the country step stays hidden', async () => {
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.fullNameError).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.emailAddressError).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 1 of 3');
        await expect.soft(aiTestingPlaygroundPage.countryStep).toBeHidden();
      });
    });

    test('a single name stays on the first step', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('one word is rejected and the email error stays hidden', async () => {
        await aiTestingPlaygroundPage.fillNameStep('Jane', 'jane@example.com');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.fullNameError).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.emailAddressError).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 1 of 3');
      });
    });

    test('an invalid email stays on the first step', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('an email without a dot in the domain is rejected', async () => {
        await aiTestingPlaygroundPage.fillNameStep('Jane Doe', 'jane@example');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.emailAddressError).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.fullNameError).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 1 of 3');
      });
    });

    test('a missing country stays on the second step', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('reach the country step', async () => {
        await aiTestingPlaygroundPage.fillNameStep('Jane Doe', 'jane@example.com');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 2 of 3');
      });

      await test.step('Next without a country stays there', async () => {
        await aiTestingPlaygroundPage.continueFromCountryStep();
        await expect(aiTestingPlaygroundPage.countryError).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 2 of 3');
        await expect.soft(aiTestingPlaygroundPage.termsStep).toBeHidden();
      });
    });

    test('missing terms stay on the third step', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('reach the terms step', async () => {
        await aiTestingPlaygroundPage.fillNameStep('Jane Doe', 'jane@example.com');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 2 of 3');
        await aiTestingPlaygroundPage.fillCountryStep('France', '');
        await aiTestingPlaygroundPage.continueFromCountryStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 3 of 3');
      });

      await test.step('Submit without the terms shows the error', async () => {
        await aiTestingPlaygroundPage.submitMultiStepForm();
        await expect(aiTestingPlaygroundPage.termsError).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.multiStepSuccessMessage).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 3 of 3');
      });
    });

    test('a corrected email opens the country step', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the email error is shown', async () => {
        await aiTestingPlaygroundPage.fillNameStep('Jane Doe', 'jane@example');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.emailAddressError).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 1 of 3');
      });

      await test.step('a valid email opens the country step', async () => {
        await aiTestingPlaygroundPage.fillNameStep('Jane Doe', 'jane@example.com');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 2 of 3');
        await expect.soft(aiTestingPlaygroundPage.countryStep).toBeVisible();
      });
    });

    test('back from the country step keeps the name and email', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('reach the country step', async () => {
        await aiTestingPlaygroundPage.fillNameStep('Jane Doe', 'jane@example.com');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 2 of 3');
      });

      await test.step('Back returns to the name step and keeps the values', async () => {
        await aiTestingPlaygroundPage.backToNameStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 1 of 3');
        await expect(aiTestingPlaygroundPage.nameStep).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.fullNameField).toHaveValue('Jane Doe');
        await expect.soft(aiTestingPlaygroundPage.emailAddressField).toHaveValue('jane@example.com');
        await expect.soft(aiTestingPlaygroundPage.countryStep).toBeHidden();
      });
    });

    test('a non-numeric phone does not block the country step', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('reach the country step', async () => {
        await aiTestingPlaygroundPage.fillNameStep('Jane Doe', 'jane@example.com');
        await aiTestingPlaygroundPage.continueFromNameStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 2 of 3');
      });

      await test.step('abc is accepted with a country', async () => {
        await aiTestingPlaygroundPage.fillCountryStep('Germany', 'abc');
        await expect.soft(aiTestingPlaygroundPage.phoneField).toHaveValue('abc');
        await aiTestingPlaygroundPage.continueFromCountryStep();
        await expect(aiTestingPlaygroundPage.stepIndicator).toHaveText('Step 3 of 3');
        await expect.soft(aiTestingPlaygroundPage.termsStep).toBeVisible();
      });
    });
  });

  test.describe('Auto-Dismiss Toast', () => {
    test('the toast stays dismissed until it is triggered', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the toast is transparent', async () => {
        /**
         * toBeVisible() ignores opacity, so it would pass on the first poll while the toast is not shown.
         */
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '0');
        await expect.soft(aiTestingPlaygroundPage.toast).not.toHaveClass(toastShownClass);
        await expect.soft(aiTestingPlaygroundPage.toast).toHaveText('Notification triggered');
      });
    });

    test('the toast shows action completed and then dismisses', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the toast fades in', async () => {
        await aiTestingPlaygroundPage.triggerToast();
        /**
         * The class and the text change in the click. Opacity fades for about 0.3 seconds,
         * so the opacity check is the wait. A text check on its own would pass on the first poll
         * while the toast is still transparent.
         */
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '1');
        await expect(aiTestingPlaygroundPage.toast).toHaveText('Action completed');
        await expect.soft(aiTestingPlaygroundPage.toast).toHaveClass(toastShownClass);
      });

      await test.step('the toast fades out', async () => {
        /**
         * The show class comes off after 2 seconds, then the opacity fades back to 0.
         * The node stays, and the text stays. A hidden check is the wrong condition,
         * and an opacity check that ran before the toast was shown would pass on the first poll.
         */
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '0');
        await expect.soft(aiTestingPlaygroundPage.toast).toHaveText('Action completed');
        await expect.soft(aiTestingPlaygroundPage.toast).not.toHaveClass(toastShownClass);
      });
    });

    test('the toast can be shown again after it dismisses', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the first toast fades out', async () => {
        await aiTestingPlaygroundPage.triggerToast();
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '1');
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '0');
      });

      await test.step('a second trigger shows it again', async () => {
        await aiTestingPlaygroundPage.triggerToast();
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '1');
        await expect(aiTestingPlaygroundPage.toast).toHaveText('Action completed');
      });
    });
  });

  test.describe('Re-Enable Delay', () => {
    test('the button disables and then becomes ready', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the button starts enabled', async () => {
        await expect(aiTestingPlaygroundPage.reEnableButton).toBeEnabled();
        await expect(aiTestingPlaygroundPage.reEnableStatus).toHaveText('');
      });

      await test.step('the click disables it', async () => {
        await aiTestingPlaygroundPage.clickReEnableButton();
        /**
         * The button starts enabled. The ready check comes after this disabled check.
         * An enabled check that ran before the button was disabled would pass on the first poll.
         */
        await expect(aiTestingPlaygroundPage.reEnableButton).toBeDisabled();
        await expect(aiTestingPlaygroundPage.reEnableStatus).toHaveText(reEnablingStatus);
      });

      await test.step('the button becomes ready', async () => {
        await expect(aiTestingPlaygroundPage.reEnableButton).toBeEnabled();
        await expect(aiTestingPlaygroundPage.reEnableStatus).toHaveText('Ready');
      });
    });

    test('a second click disables the button again', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('wait until the button is ready', async () => {
        await aiTestingPlaygroundPage.clickReEnableButton();
        await expect(aiTestingPlaygroundPage.reEnableButton).toBeDisabled();
        await expect(aiTestingPlaygroundPage.reEnableButton).toBeEnabled();
        await expect(aiTestingPlaygroundPage.reEnableStatus).toHaveText('Ready');
      });

      await test.step('the second click disables it', async () => {
        await aiTestingPlaygroundPage.clickReEnableButton();
        await expect(aiTestingPlaygroundPage.reEnableButton).toBeDisabled();
        await expect(aiTestingPlaygroundPage.reEnableStatus).toHaveText(reEnablingStatus);
      });
    });
  });
});
