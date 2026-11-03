import { test, expect } from '@/fixtures/base-test';

/**
 * Option values are the visible label in lower case.
 * Color and vegetable captions are not labels, so those radios are found by value.
 */

test.describe('Dropdown, Checkbox & Radio', () => {

  test.beforeEach(async ({ dropdownCheckboxRadioPage }) => {
    await dropdownCheckboxRadioPage.navigateTo();
  });

  test.describe('Dropdown menus', () => {

    // The option value is the label in lower case.
    test('the language menu selects C#', { tag: ['@smoke'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectLanguage('C#');
      await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('c#');
      await expect.soft(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.languageDropdown)).toHaveText('C#');
    });

    test('the tool menu selects TestNG', { tag: ['@smoke'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectTool('TestNG');
      await expect(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('testng');
      await expect.soft(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.toolDropdown)).toHaveText('TestNG');
    });

    test('the technology menu selects JQuery', { tag: ['@smoke'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectTechnology('JQuery');
      await expect(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('jquery');
      await expect.soft(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.technologyDropdown)).toHaveText('JQuery');
    });

    // None of these selects sets selected, so the first option is showing.
    test('dropdowns start on their first option', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('languages start on JAVA', async () => {
        await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('java');
        await expect.soft(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.languageDropdown)).toHaveText('JAVA');
      });

      await test.step('tools start on Eclipse', async () => {
        await expect(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('eclipse');
        await expect.soft(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.toolDropdown)).toHaveText('Eclipse');
      });

      await test.step('technologies start on HTML', async () => {
        await expect(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('html');
        await expect.soft(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.technologyDropdown)).toHaveText('HTML');
      });
    });

    test('selecting one dropdown leaves the others unchanged', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('Python leaves the other menus', async () => {
        await dropdownCheckboxRadioPage.selectLanguage('Python');
        await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('python');
        await expect.soft(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('eclipse');
        await expect.soft(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('html');
        await expect.soft(dropdownCheckboxRadioPage.fruitDropdown).toHaveValue('grape');
      });

      await test.step('Apple leaves the language menu', async () => {
        await dropdownCheckboxRadioPage.selectFruit('Apple');
        await expect(dropdownCheckboxRadioPage.fruitDropdown).toHaveValue('apple');
        await expect.soft(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('python');
        await expect.soft(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('eclipse');
        await expect.soft(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('html');
      });
    });

    // Each menu is a single select. The second choice replaces the first.
    test('SQL replaces Python', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectLanguage('Python');
      await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('python');
      await dropdownCheckboxRadioPage.selectLanguage('SQL');
      await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('sql');
      await expect(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.languageDropdown)).toHaveCount(1);
      await expect(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.languageDropdown)).toHaveText('SQL');
    });

    test('JUnit replaces Maven', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectTool('Maven');
      await expect(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('maven');
      await dropdownCheckboxRadioPage.selectTool('JUnit');
      await expect(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('junit');
      await expect(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.toolDropdown)).toHaveCount(1);
      await expect(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.toolDropdown)).toHaveText('JUnit');
    });

    test('CSS replaces JavaScript', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectTechnology('JavaScript');
      await expect(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('javascript');
      await dropdownCheckboxRadioPage.selectTechnology('CSS');
      await expect(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('css');
      await expect(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.technologyDropdown)).toHaveCount(1);
      await expect(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.technologyDropdown)).toHaveText('CSS');
    });

  });

  test.describe('Checkboxes', () => {

    test('several checkboxes can be checked', { tag: ['@smoke'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('check Option 1 and Option 4', async () => {
        await dropdownCheckboxRadioPage.option1Checkbox.check();
        await dropdownCheckboxRadioPage.option4Checkbox.check();
      });

      await test.step('those two are checked and the others stay as they were', async () => {
        await expect.soft(dropdownCheckboxRadioPage.option1Checkbox).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option2Checkbox).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option3Checkbox).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option4Checkbox).toBeChecked();
      });
    });

    // Option 3 is the only checkbox with the checked attribute.
    test('option 3 starts checked', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect.soft(dropdownCheckboxRadioPage.option1Checkbox).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.option2Checkbox).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.option3Checkbox).toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.option4Checkbox).not.toBeChecked();
    });

    test('the pre-checked checkbox can be unchecked', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('Option 3 starts checked', async () => {
        await expect(dropdownCheckboxRadioPage.option3Checkbox).toBeChecked();
      });

      await test.step('uncheck Option 3', async () => {
        await dropdownCheckboxRadioPage.option3Checkbox.uncheck();
        await expect(dropdownCheckboxRadioPage.option3Checkbox).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option1Checkbox).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option2Checkbox).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option4Checkbox).not.toBeChecked();
      });
    });

    test('unchecking one checkbox leaves the others', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('check Option 1 and Option 2', async () => {
        await dropdownCheckboxRadioPage.option1Checkbox.check();
        await dropdownCheckboxRadioPage.option2Checkbox.check();
      });

      await test.step('uncheck Option 1', async () => {
        await dropdownCheckboxRadioPage.option1Checkbox.uncheck();
        await expect(dropdownCheckboxRadioPage.option1Checkbox).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option2Checkbox).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option3Checkbox).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.option4Checkbox).not.toBeChecked();
      });
    });

  });

  test.describe('Radio buttons', () => {

    test('a color radio can be selected', { tag: ['@smoke'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('select Blue', async () => {
        await dropdownCheckboxRadioPage.blueRadio.check();
      });

      await test.step('only Blue is selected', async () => {
        await expect(dropdownCheckboxRadioPage.blueRadio).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.greenRadio).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.yellowRadio).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.orangeRadio).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.purpleRadio).not.toBeChecked();
      });
    });

    // None of the color radios has the checked attribute.
    test('no color radio starts selected', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect.soft(dropdownCheckboxRadioPage.greenRadio).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.blueRadio).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.yellowRadio).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.orangeRadio).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.purpleRadio).not.toBeChecked();
    });

    test('selecting a color clears the previous color', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('select Yellow', async () => {
        await dropdownCheckboxRadioPage.yellowRadio.check();
        await expect(dropdownCheckboxRadioPage.yellowRadio).toBeChecked();
      });

      await test.step('select Orange', async () => {
        await dropdownCheckboxRadioPage.orangeRadio.check();
        await expect(dropdownCheckboxRadioPage.orangeRadio).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.yellowRadio).not.toBeChecked();
      });
    });

    // check() does not click a radio that is already selected, so the second action is click().
    test('clicking the selected color again leaves it selected', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('select Purple', async () => {
        await dropdownCheckboxRadioPage.purpleRadio.check();
        await expect(dropdownCheckboxRadioPage.purpleRadio).toBeChecked();
      });

      await test.step('click Purple again', async () => {
        await dropdownCheckboxRadioPage.purpleRadio.click();
        await expect(dropdownCheckboxRadioPage.purpleRadio).toBeChecked();
      });
    });

  });

  test.describe('Selected and disabled', () => {

    test('lettuce can be selected, which clears pumpkin', { tag: ['@smoke'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.lettuceRadio.check();
      await expect(dropdownCheckboxRadioPage.lettuceRadio).toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.pumpkinRadio).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.cabbageRadio).not.toBeChecked();
    });

    test('pear can be selected', { tag: ['@smoke'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectFruit('Pear');
      await expect(dropdownCheckboxRadioPage.fruitDropdown).toHaveValue('pear');
      await expect(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.fruitDropdown)).toHaveCount(1);
      await expect(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.fruitDropdown)).toHaveText('Pear');
    });

    // Pumpkin has checked. Cabbage has disabled.
    test('pumpkin starts selected and cabbage is disabled', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect.soft(dropdownCheckboxRadioPage.lettuceRadio).toBeEnabled();
      await expect.soft(dropdownCheckboxRadioPage.lettuceRadio).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.cabbageRadio).toBeDisabled();
      await expect.soft(dropdownCheckboxRadioPage.cabbageRadio).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.pumpkinRadio).toBeEnabled();
      await expect.soft(dropdownCheckboxRadioPage.pumpkinRadio).toBeChecked();
    });

    // Grape has selected, so Apple is not the default. Orange is disabled.
    test('grape starts selected and orange is disabled', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect(dropdownCheckboxRadioPage.fruitDropdown).toHaveValue('grape');
      await expect.soft(dropdownCheckboxRadioPage.selectedOption(dropdownCheckboxRadioPage.fruitDropdown)).toHaveText('Grape');
      await expect.soft(dropdownCheckboxRadioPage.orangeOption).toBeDisabled();
    });

    // color and vegetable are different name groups.
    test('color and vegetable radios are separate groups', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('Green leaves Pumpkin selected', async () => {
        await dropdownCheckboxRadioPage.greenRadio.check();
        await expect(dropdownCheckboxRadioPage.greenRadio).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.pumpkinRadio).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.lettuceRadio).not.toBeChecked();
      });

      await test.step('Lettuce leaves Green selected', async () => {
        await dropdownCheckboxRadioPage.lettuceRadio.check();
        await expect(dropdownCheckboxRadioPage.lettuceRadio).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.pumpkinRadio).not.toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.greenRadio).toBeChecked();
        await expect.soft(dropdownCheckboxRadioPage.cabbageRadio).not.toBeChecked();
      });
    });

  });

});
