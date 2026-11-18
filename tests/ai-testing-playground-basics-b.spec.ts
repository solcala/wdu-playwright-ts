import { test, expect } from '@/fixtures/base-test';

/**
 * Basics B on AI Testing Playground: Moving Target, Conditional Validation, Race Condition,
 * and Lazy-Rendered Element.
 * Catch Me jumps about every 1.5 seconds. The click shows the shared toast, Got it!.
 * The code field appears on Submit of a valid email, not while the email is typed.
 * Either race can win. The lazy sentence is in the page, hidden, until Reveal Element.
 * The case list is specs/ai-testing-playground-basics-b.plan.md.
 */

const toastShownClass = /(?:^|\s)show(?:\s|$)/;

const raceWinnerText = /^Race [AB] won!$/;

const lazySelectorText = /^#lazy-\d+$/;

const verificationMessage = 'Verification required. Please enter the code.';

const conditionalEmailErrorText = 'Valid email required';

const raceARunning = 'Race A running…';

const raceBRunning = 'Race B running…';

const conditionalSuccessMessage = 'Submitted successfully.';

const verificationColor = 'rgb(192, 57, 43)';

const conditionalSuccessColor = 'rgb(31, 143, 58)';

test.describe('AI Testing Playground', { tag: ['@ai-testing-playground', '@ai-testing-playground-basics-b'] }, () => {
  test.beforeEach(async ({ aiTestingPlaygroundPage }) => {
    await aiTestingPlaygroundPage.navigateTo();
  });

  test.describe('Moving Target', () => {
    test('clicking the moving button shows got it', { tag: ['@smoke', '@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Catch Me shows the toast and the toast fades out', async () => {
        await aiTestingPlaygroundPage.catchMovingTarget();
        /**
         * The text is set in the click. Opacity fades in, so the opacity check is the wait.
         * A text check on its own would pass on the first poll while the toast is still transparent.
         * The click retries until the button is stable. The button jumps about every 1.5 seconds.
         */
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '1');
        await expect(aiTestingPlaygroundPage.toast).toHaveText('Got it!');
        await expect.soft(aiTestingPlaygroundPage.toast).toHaveClass(toastShownClass);
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '0');
        await expect.soft(aiTestingPlaygroundPage.toast).toHaveText('Got it!');
      });
    });

    test('the catch is not shown before the click', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the toast is transparent and Catch Me is ready', async () => {
        /**
         * This test does not click. An opacity 0 check after the click would pass on the first poll,
         * during the fade-in. toBeVisible() ignores opacity.
         */
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '0');
        await expect.soft(aiTestingPlaygroundPage.toast).toHaveText('Notification triggered');
        await expect.soft(aiTestingPlaygroundPage.toast).not.toHaveClass(toastShownClass);
        await expect(aiTestingPlaygroundPage.movingTargetButton).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.movingTargetButton).toBeEnabled();
      });
    });

    test('the button moves from its starting position', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('left or top changes', async () => {
        await expect(aiTestingPlaygroundPage.movingTargetButton).toBeVisible();
        const start = await aiTestingPlaygroundPage.movingTargetOffset();
        /**
         * The catch can land during the pause between jumps. The condition is a new offset.
         * The jump is about 1.5 seconds. The poll is the wait.
         */
        await expect
          .poll(async () => {
            const now = await aiTestingPlaygroundPage.movingTargetOffset();
            return now.left !== start.left || now.top !== start.top;
          })
          .toBe(true);
      });
    });

    test('a second click shows got it again', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the first toast fades out', async () => {
        await aiTestingPlaygroundPage.catchMovingTarget();
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '1');
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '0');
      });

      await test.step('a second Catch Me shows it again', async () => {
        await aiTestingPlaygroundPage.catchMovingTarget();
        /**
         * The second opacity 1 would pass on the first poll if the first toast were still up.
         * The fade-out above is the gate.
         */
        await expect(aiTestingPlaygroundPage.toast).toHaveCSS('opacity', '1');
        await expect(aiTestingPlaygroundPage.toast).toHaveText('Got it!');
      });
    });
  });

  test.describe('Conditional Validation', () => {
    test('a valid email and a six-digit code submit', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('a valid email asks for a code', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('ada@example.com');
        /**
         * The code field appears on Submit, not while the email is typed.
         * It starts hidden, so this check is after the email is filled.
         */
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeHidden();
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalResult).toHaveText(verificationMessage);
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.conditionalEmailError).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.conditionalResult).toHaveCSS('color', verificationColor);
      });

      await test.step('a six-digit code submits', async () => {
        await aiTestingPlaygroundPage.fillConditionalCode('123456');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalResult).toHaveText(conditionalSuccessMessage);
        await expect.soft(aiTestingPlaygroundPage.conditionalResult).toHaveCSS('color', conditionalSuccessColor);
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.conditionalEmailField).toHaveValue('');
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toHaveValue('');
      });
    });

    test('an invalid email does not ask for a code', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('an email without a dot in the domain is rejected', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('ada@example');
        await aiTestingPlaygroundPage.submitConditionalForm();
        /**
         * The sentence is already in the page. The visibility check is the wait.
         */
        await expect(aiTestingPlaygroundPage.conditionalEmailError).toBeVisible();
        await expect(aiTestingPlaygroundPage.conditionalEmailError).toHaveText(conditionalEmailErrorText);
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.conditionalResult).toHaveText('');
        await expect.soft(aiTestingPlaygroundPage.conditionalEmailField).toHaveValue('ada@example');
      });
    });

    test('an empty email shows the email error', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Submit with an empty email is rejected', async () => {
        await aiTestingPlaygroundPage.submitConditionalForm();
        /**
         * The sentence is already in the page. The visibility check is the wait.
         */
        await expect(aiTestingPlaygroundPage.conditionalEmailError).toBeVisible();
        await expect(aiTestingPlaygroundPage.conditionalEmailError).toHaveText(conditionalEmailErrorText);
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.conditionalResult).toHaveText('');
      });
    });

    test('a missing code stays on verification', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('a valid email asks for a code', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('ada@example.com');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalResult).toHaveText(verificationMessage);
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeVisible();
      });

      await test.step('Submit with an empty code stays there', async () => {
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalCodeError).toBeVisible();
        await expect(aiTestingPlaygroundPage.conditionalResult).toHaveText(verificationMessage);
        await expect.soft(aiTestingPlaygroundPage.conditionalResult).not.toHaveText(conditionalSuccessMessage);
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toBeVisible();
      });
    });

    test('a five-digit code is rejected', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('a valid email asks for a code', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('ada@example.com');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeVisible();
      });

      await test.step('12345 is rejected and the field keeps it', async () => {
        await aiTestingPlaygroundPage.fillConditionalCode('12345');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalCodeError).toBeVisible();
        await expect(aiTestingPlaygroundPage.conditionalResult).toHaveText(verificationMessage);
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toHaveValue('12345');
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toBeVisible();
      });
    });

    test('editing the email hides the email error', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the email error is shown', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('ada@example');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalEmailError).toBeVisible();
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeHidden();
      });

      await test.step('another invalid email hides the error and does not ask for a code', async () => {
        /**
         * The error is hidden on any input, including a value that is still invalid.
         * The hidden check comes after the error was shown. A hidden check that ran first would pass on the first poll.
         */
        await aiTestingPlaygroundPage.fillConditionalEmail('still-bad');
        await expect(aiTestingPlaygroundPage.conditionalEmailError).toBeHidden();
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.conditionalResult).toHaveText('');
        await expect.soft(aiTestingPlaygroundPage.conditionalEmailField).toHaveValue('still-bad');
      });
    });

    test('editing the email withdraws the code field', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the code field is showing', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('ada@example.com');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeVisible();
        await aiTestingPlaygroundPage.fillConditionalCode('123456');
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toHaveValue('123456');
      });

      await test.step('a new email hides the code field and clears the code', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('bey@example.com');
        /**
         * Hiding the field and clearing the code are separate results of the same input.
         * Either can fail on its own.
         */
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toBeHidden();
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toHaveValue('');
        await expect.soft(aiTestingPlaygroundPage.conditionalResult).toHaveText('');
        await expect.soft(aiTestingPlaygroundPage.conditionalEmailField).toHaveValue('bey@example.com');
      });
    });

    test('a seventh digit submits as six digits', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('a valid email asks for a code', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('ada@example.com');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeVisible();
      });

      await test.step('the field keeps the first six digits and those six submit', async () => {
        await aiTestingPlaygroundPage.fillConditionalCode('1234567');
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toHaveValue('123456');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalResult).toHaveText(conditionalSuccessMessage);
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toBeHidden();
      });
    });

    test('a code with a leading space is rejected', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('a valid email asks for a code', async () => {
        await aiTestingPlaygroundPage.fillConditionalEmail('ada@example.com');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toBeVisible();
      });

      await test.step('a leading space fills the field and the code is rejected', async () => {
        await aiTestingPlaygroundPage.fillConditionalCode(' 12345');
        await expect(aiTestingPlaygroundPage.conditionalCodeField).toHaveValue(' 12345');
        await aiTestingPlaygroundPage.submitConditionalForm();
        await expect(aiTestingPlaygroundPage.conditionalCodeError).toBeVisible();
        await expect(aiTestingPlaygroundPage.conditionalResult).toHaveText(verificationMessage);
        await expect.soft(aiTestingPlaygroundPage.conditionalCodeField).toHaveValue(' 12345');
      });
    });
  });

  test.describe('Race Condition', () => {
    test('starting both races names one winner and then clears', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('both races are running', async () => {
        await aiTestingPlaygroundPage.startRaceA();
        /**
         * The running line is set in the click. The timer is at least 0.5 seconds,
         * so this check passes on the first poll. It fails if Race A never started.
         */
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText(raceARunning);
        await aiTestingPlaygroundPage.startRaceB();
        /**
         * Race B overwrites that line while no winner is set.
         * If Race A had already won, or this click did nothing, the line stays Race A.
         */
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText(raceBRunning);
      });

      await test.step('one winner holds until the result clears', async () => {
        /**
         * Each timer is 0.5 to 2.5 seconds. Either name is a pass.
         * The result starts empty, so the empty check comes after the win.
         */
        /**
         * The winner is the text from the read that first matches. A second read could already name the other race.
         */
        let winner = '';
        await expect
          .poll(async () => {
            const next = await aiTestingPlaygroundPage.readRaceWinner(winner);
            winner = next.winner;
            return next.text;
          })
          .toMatch(raceWinnerText);
        let replaced = false;
        await expect
          .poll(async () => {
            const next = await aiTestingPlaygroundPage.raceTextWhileWinnerHolds(winner, replaced);
            replaced = next.replaced;
            return next.value;
          })
          .toBe('');
      });
    });

    test('starting only race A names race A', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the only timer is Race A', async () => {
        await aiTestingPlaygroundPage.startRaceA();
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText('Race A won!');
      });
    });

    test('the result stays empty before a race', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('neither race has started', async () => {
        /**
         * This test does not click. The running line is set in the click, so an empty check after a click would fail.
         * An empty check before the winner is known would pass on the first poll.
         */
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText('');
        await expect.soft(aiTestingPlaygroundPage.raceAButton).toBeEnabled();
        await expect.soft(aiTestingPlaygroundPage.raceBButton).toBeEnabled();
      });
    });

    test('a late start does not replace the winner', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Race A wins', async () => {
        await aiTestingPlaygroundPage.startRaceA();
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText('Race A won!');
      });

      await test.step('Race B does not appear before the result clears', async () => {
        /**
         * The win is still showing. The click is the next line, inside that window.
         * A click after the winner is set returns immediately. The line is cleared 3 seconds after the win.
         * An empty check on its own would also pass if another line had been shown and then cleared.
         */
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText('Race A won!');
        await aiTestingPlaygroundPage.startRaceB();
        let replaced = false;
        await expect
          .poll(async () => {
            const next = await aiTestingPlaygroundPage.raceTextWhileWinnerHolds('Race A won!', replaced);
            replaced = next.replaced;
            return next.value;
          })
          .toBe('');
      });
    });

    test('race A can win again after the result clears', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the first win clears', async () => {
        await aiTestingPlaygroundPage.startRaceA();
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText('Race A won!');
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText('');
      });

      await test.step('Race A wins again', async () => {
        /**
         * The second win would be ignored if the clear had not nulled the winner.
         * The empty result above is the gate.
         */
        await aiTestingPlaygroundPage.startRaceA();
        await expect(aiTestingPlaygroundPage.raceResult).toHaveText('Race A won!');
      });
    });
  });

  test.describe('Lazy-Rendered Element', () => {
    test('revealing the element shows a generated selector', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the sentence is shown and the selector is a #lazy- value', async () => {
        await aiTestingPlaygroundPage.revealLazyElement();
        /**
         * The sentence is already in the page. A text check would pass on the first poll while it is hidden.
         * The number changes on every click. The pattern is the check.
         */
        await expect(aiTestingPlaygroundPage.lazyMessage).toBeVisible();
        await expect(aiTestingPlaygroundPage.lazySelector).toHaveText(lazySelectorText);
        await expect.soft(aiTestingPlaygroundPage.lazyMessage).toContainText('I just appeared!');
      });
    });

    test('the element stays hidden before the reveal', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the sentence is in the page and hidden', async () => {
        /**
         * This test does not click. The sentence is in the DOM under display:none.
         */
        await expect(aiTestingPlaygroundPage.lazyMessage).toBeAttached();
        await expect(aiTestingPlaygroundPage.lazyMessage).toBeHidden();
        await expect(aiTestingPlaygroundPage.lazySelector).toHaveText('');
        await expect.soft(aiTestingPlaygroundPage.revealElementButton).toBeEnabled();
      });
    });

    test('a second reveal leaves the element visible', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the sentence is shown', async () => {
        await aiTestingPlaygroundPage.revealLazyElement();
        await expect(aiTestingPlaygroundPage.lazyMessage).toBeVisible();
        await expect(aiTestingPlaygroundPage.lazySelector).toHaveText(lazySelectorText);
      });

      await test.step('a second click leaves it visible', async () => {
        /**
         * The same number can be drawn twice, so this check does not require the selector to change.
         */
        await aiTestingPlaygroundPage.revealLazyElement();
        await expect(aiTestingPlaygroundPage.lazyMessage).toBeVisible();
        await expect(aiTestingPlaygroundPage.lazySelector).toHaveText(lazySelectorText);
      });
    });
  });
});
