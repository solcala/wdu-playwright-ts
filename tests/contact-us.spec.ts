import { test, expect } from '@/fixtures/base-test';


test.describe('Contact Us Page', () => {

  test.beforeEach(async ({ contactUsPage }) => {
    await contactUsPage.navigateTo();
  });

  test.describe('Core Behavior', { tag: ['@smoke'] }, () => {

    test('navigate to contact us page', async ({ contactUsPage }) => {
      await expect.soft(contactUsPage.heading).toBeVisible();
      await expect.soft(contactUsPage.page).toHaveURL(contactUsPage.path);

    });

    test('Validate Contact Us Page Elements', async ({ contactUsPage }) => {

      await test.step('validate first name field is visible and enabled', async () => {
        await expect.soft(contactUsPage.firstNameField).toBeVisible();
        await expect.soft(contactUsPage.firstNameField).toBeEnabled();
      });

      await test.step('validate last name field is visible and enabled', async () => {
        await expect.soft(contactUsPage.lastNameField).toBeVisible();
        await expect.soft(contactUsPage.lastNameField).toBeEnabled();
      });

      await test.step('validate email address field is visible and enabled', async () => {
        await expect.soft(contactUsPage.emailAddressField).toBeVisible();
        await expect.soft(contactUsPage.emailAddressField).toBeEnabled();
      });

      await test.step('validate comments field is visible and enabled', async () => {
        await expect.soft(contactUsPage.commentsField).toBeVisible();
        await expect.soft(contactUsPage.commentsField).toBeEnabled();
      });

      await test.step('validate submit button is visible and enabled', async () => {
        await expect.soft(contactUsPage.submitButton).toBeVisible();
        await expect.soft(contactUsPage.submitButton).toBeEnabled();
      });

      await test.step('validate reset button is visible and enabled', async () => {
        await expect.soft(contactUsPage.resetButton).toBeVisible();
        await expect.soft(contactUsPage.resetButton).toBeEnabled();
      });

    });

    test('Validate that a user is able to contact us', async ({ contactUsPage, homePage }) => {
      await contactUsPage.navigateTo();

      await test.step('fill form and submit', async () => {
        await contactUsPage.fillFormAndSubmit('John', 'Doe', 'john.doe@example.com', 'This is a test comment');
      });

      await test.step('validate success message is visible', async () => {
        await expect.soft(contactUsPage.successMessage).toBeVisible();
      });

      await test.step('validate back to home page button is visible and enabled', async () => {
        await expect.soft(contactUsPage.backToHomePageButton).toBeVisible();
        await expect.soft(contactUsPage.backToHomePageButton).toBeEnabled();
      });

      await test.step('validate that the url remains the same', async () => {
        await expect.soft(contactUsPage.page).toHaveURL(contactUsPage.path);
      });

      await test.step('click on back to home page button', async () => {
        await contactUsPage.backToHomePageButton.click();
        await expect.soft(homePage.page).toHaveURL(homePage.path);
      });

    });

    test('validate Empty submit behavior', async ({ contactUsPage }) => {
      await contactUsPage.navigateTo();
      await contactUsPage.submitButton.click();
      // Actual behavior - the app displays both error messages on empty submit
      // I would suggest to only display required fields error meesage only if the field is empty and invalid email error message only if the email is invalid
      await expect.soft(contactUsPage.errorMessageRequiredFields).toBeVisible();
      await expect.soft(contactUsPage.errorMessageInvalidEmail).toBeVisible();

      await expect.soft(contactUsPage.page).toHaveURL(contactUsPage.path);
    });

    test('validate Invalid email submit behavior', async ({ contactUsPage }) => {
      await contactUsPage.navigateTo();
      await contactUsPage.fillFormAndSubmit('John', 'Doe', 'invalid-email', 'This is a test comment');

      await test.step('validate invalid email error message is visible', async () => {
        await expect.soft(contactUsPage.errorMessageInvalidEmail).toBeVisible();
      });

      await test.step('validate required fields error message is hidden', async () => {
        await expect.soft(contactUsPage.errorMessageRequiredFields).toBeHidden();
      });

      await test.step('validate page URL is the same', async () => {
        await expect.soft(contactUsPage.page).toHaveURL(contactUsPage.path);
      });
    });

  });

  test.describe('Important navigation and ui states', () => {

    test('validate reset button clears the form', async ({ contactUsPage }) => {
      await contactUsPage.navigateTo();
      await contactUsPage.fillForm('John', 'Doe', 'john.doe@example.com', 'This is a test comment');

      await test.step('validate form is filled', async () => {
        await expect.soft(contactUsPage.firstNameField).toHaveValue('John');
        await expect.soft(contactUsPage.lastNameField).toHaveValue('Doe');
        await expect.soft(contactUsPage.emailAddressField).toHaveValue('john.doe@example.com');
        await expect.soft(contactUsPage.commentsField).toHaveValue('This is a test comment');
      });

      await test.step('click on reset button and validate form is cleared', async () => {
        await contactUsPage.resetButton.click();
        await expect.soft(contactUsPage.firstNameField).toBeEmpty();
        await expect.soft(contactUsPage.lastNameField).toBeEmpty();
        await expect.soft(contactUsPage.emailAddressField).toBeEmpty();
        await expect.soft(contactUsPage.commentsField).toBeEmpty();
      });
    });





    test('validate "Back to Homepage" button navigates to home page', async ({ contactUsPage, homePage }) => {
      await contactUsPage.navigateTo();
      await contactUsPage.fillFormAndSubmit('John', 'Doe', 'john.doe@example.com', 'This is a test comment');

      await test.step('validate back to home page button is visible and enabled', async () => {
        await expect.soft(contactUsPage.backToHomePageButton).toBeVisible();
        await expect.soft(contactUsPage.backToHomePageButton).toBeEnabled();
      });

      await test.step('click on back to home page button and land in home page', async () => {
        await contactUsPage.backToHomePageButton.click();
        await expect.soft(homePage.page).toHaveURL(homePage.path);
      });

    });

    test.describe('Invalid form submission buttons navigation', () => {

      test('validate try again button navigates to contact us page', async ({ contactUsPage, homePage }) => {
        await contactUsPage.navigateTo();
        await contactUsPage.fillFormAndSubmit('John', 'Doe', 'john.doe.com', 'This is a test comment');

        await test.step('validate click on try again button and land in contact us page', async () => {
          await contactUsPage.tryAgainButton.click();
          await expect.soft(contactUsPage.page).toHaveURL(contactUsPage.path);
        });
      });

      test('validate home button navigates to home page', async ({ contactUsPage, homePage }) => {
        await contactUsPage.navigateTo();
        await contactUsPage.fillFormAndSubmit('John', 'Doe', 'john.doe.com', 'This is a test comment');

        await test.step('validate click on home button and land in home page', async () => {
          await contactUsPage.homeButton.click();
          await expect.soft(homePage.page).toHaveURL(homePage.path);
        });
      });

    });


  });


  test.describe('Edge Cases', () => {

    test('valid edge email formats are accepted', async ({ contactUsPage }) => {
      const emails = ['ada+qa@example.com', 'ada@mail.example.com'];

      for (const email of emails) {
        await test.step(`accept ${email}`, async () => {
          await contactUsPage.navigateTo();
          await contactUsPage.fillFormAndSubmit('Ada', 'Lovelace', email, 'Hello');
          await expect(contactUsPage.successMessage).toBeVisible();
        });
      }
    });

    test('invalid email formats are rejected', async ({ contactUsPage }) => {
      const emails = ['plainaddress', 'ada@', 'ada @example.com'];

      for (const email of emails) {
        await test.step(`reject ${email}`, async () => {
          await contactUsPage.navigateTo();
          await contactUsPage.fillFormAndSubmit('Ada', 'Lovelace', email, 'Hello');
          await expect(contactUsPage.errorMessageInvalidEmail).toBeVisible();
          await expect(contactUsPage.errorMessageRequiredFields).toBeHidden();
        });
      }
    });

    test('special characters are accepted and whitespace-only input is empty', async ({ contactUsPage }) => {
      await test.step('special characters in each text field', async () => {
        await contactUsPage.fillFormAndSubmit(
          'Ann-Marie',
          "O'Brien",
          'ada@example.com',
          'Cost is $5 & "quoted"',
        );
        await expect(contactUsPage.successMessage).toBeVisible();
      });

      await test.step('whitespace-only input in each field', async () => {
        await contactUsPage.navigateTo();
        await contactUsPage.fillFormAndSubmit('   ', '   ', '   ', '   ');
        await expect(contactUsPage.errorMessageRequiredFields).toBeVisible();
        await expect(contactUsPage.errorMessageInvalidEmail).toBeVisible();
      });
    });

    test('tab order follows the form and Enter submits', async ({ contactUsPage }) => {
      await test.step('tab through the fields', async () => {
        await contactUsPage.firstNameField.focus();
        await contactUsPage.page.keyboard.press('Tab');
        await expect(contactUsPage.lastNameField).toBeFocused();
        await contactUsPage.page.keyboard.press('Tab');
        await expect(contactUsPage.emailAddressField).toBeFocused();
        await contactUsPage.page.keyboard.press('Tab');
        await expect(contactUsPage.commentsField).toBeFocused();
        await contactUsPage.page.keyboard.press('Tab');
        await expect(contactUsPage.resetButton).toBeFocused();
        await contactUsPage.page.keyboard.press('Tab');
        await expect(contactUsPage.submitButton).toBeFocused();
      });

      await test.step('Enter submits from a text field', async () => {
        await contactUsPage.fillForm('Ada', 'Lovelace', 'ada@example.com', 'Hello');
        await contactUsPage.emailAddressField.focus();
        await contactUsPage.page.keyboard.press('Enter');
        await expect(contactUsPage.successMessage).toBeVisible();
      });
    });

    test('each input has an accessible name', async ({ contactUsPage }) => {
      await expect(contactUsPage.firstNameField).toHaveAccessibleName('First Name');
      await expect(contactUsPage.lastNameField).toHaveAccessibleName('Last Name');
      await expect(contactUsPage.emailAddressField).toHaveAccessibleName('Email Address');
      await expect(contactUsPage.commentsField).toHaveAccessibleName('Comments');
    });

    test('comments textarea expands and shrinks when dragged', async ({ contactUsPage }) => {
      const expanded = await contactUsPage.resizeComments(120);
      expect(expanded.after).toBeGreaterThan(expanded.before);

      const shrunk = await contactUsPage.resizeComments(-80);
      expect(shrunk.after).toBeLessThan(shrunk.before);
    });

  });

});
