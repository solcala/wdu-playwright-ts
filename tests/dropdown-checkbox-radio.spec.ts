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
    test('the language menu selects C#', { tag: ['@smoke', '@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectLanguage('C#');
      await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('c#');
      await expect.soft(dropdownCheckboxRadioPage.selectedLanguageOption).toHaveText('C#');
    });

    test('the tool menu selects TestNG', { tag: ['@smoke', '@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectTool('TestNG');
      await expect(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('testng');
      await expect.soft(dropdownCheckboxRadioPage.selectedToolOption).toHaveText('TestNG');
    });

    test('the technology menu selects JQuery', { tag: ['@smoke', '@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectTechnology('JQuery');
      await expect(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('jquery');
      await expect.soft(dropdownCheckboxRadioPage.selectedTechnologyOption).toHaveText('JQuery');
    });

    // The select does not set selected, so the first option shows.
    test('the language menu starts on JAVA', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('java');
      await expect.soft(dropdownCheckboxRadioPage.selectedLanguageOption).toHaveText('JAVA');
    });

    // The select does not set selected, so the first option shows.
    test('the tool menu starts on Eclipse', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('eclipse');
      await expect.soft(dropdownCheckboxRadioPage.selectedToolOption).toHaveText('Eclipse');
    });

    // The select does not set selected, so the first option shows.
    test('the technology menu starts on HTML', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('html');
      await expect.soft(dropdownCheckboxRadioPage.selectedTechnologyOption).toHaveText('HTML');
    });

    test('selecting Python leaves the other menus unchanged', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectLanguage('Python');
      await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('python');
      await expect.soft(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('eclipse');
      await expect.soft(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('html');
      await expect.soft(dropdownCheckboxRadioPage.fruitDropdown).toHaveValue('grape');
    });

    test('selecting Apple leaves the other menus unchanged', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectFruit('Apple');
      await expect(dropdownCheckboxRadioPage.fruitDropdown).toHaveValue('apple');
      await expect.soft(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('java');
      await expect.soft(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('eclipse');
      await expect.soft(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('html');
    });

    // This menu is a single select, so the second choice replaces the first.
    test('SQL replaces Python', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('select Python', async () => {
        await dropdownCheckboxRadioPage.selectLanguage('Python');
        await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('python');
      });

      await test.step('select SQL instead', async () => {
        await dropdownCheckboxRadioPage.selectLanguage('SQL');
        await expect(dropdownCheckboxRadioPage.languageDropdown).toHaveValue('sql');
        await expect(dropdownCheckboxRadioPage.selectedLanguageOption).toHaveCount(1);
        await expect(dropdownCheckboxRadioPage.selectedLanguageOption).toHaveText('SQL');
      });
    });

    // This menu is a single select, so the second choice replaces the first.
    test('JUnit replaces Maven', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('select Maven', async () => {
        await dropdownCheckboxRadioPage.selectTool('Maven');
        await expect(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('maven');
      });

      await test.step('select JUnit instead', async () => {
        await dropdownCheckboxRadioPage.selectTool('JUnit');
        await expect(dropdownCheckboxRadioPage.toolDropdown).toHaveValue('junit');
        await expect(dropdownCheckboxRadioPage.selectedToolOption).toHaveCount(1);
        await expect(dropdownCheckboxRadioPage.selectedToolOption).toHaveText('JUnit');
      });
    });

    // This menu is a single select, so the second choice replaces the first.
    test('CSS replaces JavaScript', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await test.step('select JavaScript', async () => {
        await dropdownCheckboxRadioPage.selectTechnology('JavaScript');
        await expect(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('javascript');
      });

      await test.step('select CSS instead', async () => {
        await dropdownCheckboxRadioPage.selectTechnology('CSS');
        await expect(dropdownCheckboxRadioPage.technologyDropdown).toHaveValue('css');
        await expect(dropdownCheckboxRadioPage.selectedTechnologyOption).toHaveCount(1);
        await expect(dropdownCheckboxRadioPage.selectedTechnologyOption).toHaveText('CSS');
      });
    });
  });

  test.describe('Checkboxes', () => {
    test('several checkboxes can be checked', { tag: ['@smoke', '@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
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

    // The page sets the checked attribute only on Option 3.
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
    test('a color radio can be selected', { tag: ['@smoke', '@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
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

    // The page does not set checked on any color radio.
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
    test('lettuce can be selected, which clears pumpkin', { tag: ['@smoke', '@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.lettuceRadio.check();
      await expect(dropdownCheckboxRadioPage.lettuceRadio).toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.pumpkinRadio).not.toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.cabbageRadio).not.toBeChecked();
    });

    test('pear can be selected', { tag: ['@smoke', '@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await dropdownCheckboxRadioPage.selectFruit('Pear');
      await expect(dropdownCheckboxRadioPage.fruitDropdown).toHaveValue('pear');
      await expect(dropdownCheckboxRadioPage.selectedFruitOption).toHaveCount(1);
      await expect(dropdownCheckboxRadioPage.selectedFruitOption).toHaveText('Pear');
    });

    // The page sets the checked attribute on Pumpkin.
    test('pumpkin starts selected', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect(dropdownCheckboxRadioPage.pumpkinRadio).toBeChecked();
      await expect.soft(dropdownCheckboxRadioPage.pumpkinRadio).toBeEnabled();
      await expect.soft(dropdownCheckboxRadioPage.lettuceRadio).toBeEnabled();
      await expect.soft(dropdownCheckboxRadioPage.lettuceRadio).not.toBeChecked();
    });

    // The page sets the disabled attribute on Cabbage.
    test('cabbage is disabled', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect(dropdownCheckboxRadioPage.cabbageRadio).toBeDisabled();
      await expect.soft(dropdownCheckboxRadioPage.cabbageRadio).not.toBeChecked();
    });

    // The page sets selected on Grape, so the first option, Apple, is not the default.
    test('the fruit menu starts on Grape', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect(dropdownCheckboxRadioPage.fruitDropdown).toHaveValue('grape');
      await expect.soft(dropdownCheckboxRadioPage.selectedFruitOption).toHaveText('Grape');
    });

    // The page sets the disabled attribute on Orange.
    test('orange is disabled', { tag: ['@regression'] }, async ({ dropdownCheckboxRadioPage }) => {
      await expect(dropdownCheckboxRadioPage.orangeFruitOption).toBeDisabled();
    });

    // The color and vegetable inputs use different name attributes.
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
