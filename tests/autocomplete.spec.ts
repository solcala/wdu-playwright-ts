import { test, expect } from '@/fixtures/base-test';

/**
 * The field filters a fixed food list by prefix. The check ignores case and keeps the catalog spelling.
 * A click or Enter on a highlighted row copies that catalog value into the field and closes the list.
 * Enter does not submit. Submit stays on this page and sends the field as the food-item query.
 * The case list is specs/autocomplete.plan.md.
 */

// The catalog spelling is Avacado, with one c. The order is the catalog order.
const foodsStartingWithA = ['Asparagus', 'Avacado', 'Almond', 'Artichoke', 'Apple'];

test.describe('Autocomplete', { tag: ['@autocomplete'] }, () => {
  test.beforeEach(async ({ autocompletePage }) => {
    await autocompletePage.navigateTo();
  });

  test('selecting Pizza and submitting sends Pizza', { tag: ['@smoke', '@regression'] }, async ({ autocompletePage }) => {
    await test.step('Pi shows only Pizza', async () => {
      await autocompletePage.typeFoodItem('Pi');
      await expect(autocompletePage.suggestions).toHaveText(['Pizza']);
      await expect.soft(autocompletePage.foodItemField).toHaveValue('Pi');
    });

    await test.step('the click copies Pizza into the field', async () => {
      await autocompletePage.selectSuggestion('Pizza');
      await expect(autocompletePage.foodItemField).toHaveValue('Pizza');
      await expect(autocompletePage.suggestionList).toBeHidden();
    });

    await test.step('Submit sends Pizza', async () => {
      await autocompletePage.submit();
      await expect(autocompletePage.page).toHaveURL(`${autocompletePage.path}?food-item=Pizza`);
    });
  });

  test('typing a shows only the foods that start with A', { tag: ['@regression'] }, async ({ autocompletePage }) => {
    await test.step('a shows the foods that start with A', async () => {
      await autocompletePage.typeFoodItem('a');
      await expect(autocompletePage.suggestions).toHaveText(foodsStartingWithA);
    });
  });

  test('an unknown prefix shows no foods', { tag: ['@regression'] }, async ({ autocompletePage }) => {
    await test.step('zz shows no foods', async () => {
      await autocompletePage.typeFoodItem('zz');
      await expect.soft(autocompletePage.foodItemField).toHaveValue('zz');
      await expect.soft(autocompletePage.suggestionList).toBeAttached();
      await expect.soft(autocompletePage.suggestions).toHaveCount(0);
    });
  });

  test('submitting a prefix sends the typed text', { tag: ['@regression'] }, async ({ autocompletePage }) => {
    await test.step('App shows Apple', async () => {
      await autocompletePage.typeFoodItem('App');
      await expect(autocompletePage.suggestions).toHaveText(['Apple']);
    });

    await test.step('Submit sends App', async () => {
      await autocompletePage.submit();
      await expect(autocompletePage.page).toHaveURL(`${autocompletePage.path}?food-item=App`);
    });
  });

  test('an uppercase prefix shows the catalog food', { tag: ['@regression'] }, async ({ autocompletePage }) => {
    await test.step('APP shows Apple', async () => {
      await autocompletePage.typeFoodItem('APP');
      await expect(autocompletePage.suggestions).toHaveText(['Apple']);
      await expect.soft(autocompletePage.foodItemField).toHaveValue('APP');
    });
  });

  test('arrow down and enter fills the highlighted food without submitting', { tag: ['@regression'] }, async ({ autocompletePage }) => {
    await test.step('gr shows three foods', async () => {
      await autocompletePage.typeFoodItem('gr');
      await expect(autocompletePage.suggestions).toHaveText(['Granola', 'Grapes', 'Green beans']);
    });

    await test.step('Arrow Down highlights Grapes', async () => {
      await autocompletePage.highlightNextSuggestion();
      await expect(autocompletePage.suggestion('Granola')).toHaveClass(/autocomplete-active/);
      await autocompletePage.highlightNextSuggestion();
      await expect(autocompletePage.suggestion('Grapes')).toHaveClass(/autocomplete-active/);
      await expect.soft(autocompletePage.suggestion('Granola')).not.toHaveClass(/autocomplete-active/);
    });

    await test.step('Enter copies Grapes and stays on the form', async () => {
      await autocompletePage.pressEnterInFoodItemField();
      await expect.soft(autocompletePage.foodItemField).toHaveValue('Grapes');
      await expect.soft(autocompletePage.suggestionList).toBeHidden();
      await expect.soft(autocompletePage.page).toHaveURL(autocompletePage.path);
    });
  });

  test('enter without a highlighted food does not submit', { tag: ['@regression'] }, async ({ autocompletePage }) => {
    await test.step('Pi shows Pizza', async () => {
      await autocompletePage.typeFoodItem('Pi');
      await expect(autocompletePage.suggestions).toHaveText(['Pizza']);
    });

    await test.step('Enter leaves the form as it is', async () => {
      await autocompletePage.pressEnterInFoodItemField();
      await expect.soft(autocompletePage.page).toHaveURL(autocompletePage.path);
      await expect.soft(autocompletePage.foodItemField).toHaveValue('Pi');
      await expect.soft(autocompletePage.suggestions).toHaveText(['Pizza']);
    });
  });

  test('clicking outside closes the suggestions', { tag: ['@regression'] }, async ({ autocompletePage }) => {
    await test.step('b opens the list', async () => {
      await autocompletePage.typeFoodItem('b');
      await expect(autocompletePage.suggestionList).toBeVisible();
    });

    await test.step('the heading click closes it and leaves b', async () => {
      await autocompletePage.clickOutsideSuggestions();
      await expect(autocompletePage.suggestionList).toBeHidden();
      await expect(autocompletePage.foodItemField).toHaveValue('b');
    });
  });

  test('submitting an empty field sends an empty food item', { tag: ['@regression'] }, async ({ autocompletePage }) => {
    await test.step('the field starts empty', async () => {
      await expect(autocompletePage.foodItemField).toHaveValue('');
    });

    await test.step('Submit sends an empty food item', async () => {
      await autocompletePage.submit();
      await expect(autocompletePage.page).toHaveURL(`${autocompletePage.path}?food-item=`);
    });
  });
});
