import { test, expect } from '@/fixtures/base-test';

/**
 * Enter appends a row and clears the field. The plus icon only hides and shows the field.
 * A click on a row toggles completed, which strikes the text through.
 * The delete control is a span at width 0 until the row is hovered. A click then fades the row out and removes it.
 * The case list is specs/todo-list.plan.md.
 */

const seedCount = 3;
const restingColor = 'rgb(154, 154, 154)';
const completedColor = 'rgb(128, 128, 128)';
const practiceItems = ['Go to potion class', 'Buy new robes', 'Practice magic'];

test.describe('To Do List', { tag: ['@todo-list'] }, () => {
  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.navigateTo();
  });

  test('the list starts with the three practice items', { tag: ['@regression'] }, async ({ todoListPage }) => {
    await test.step('three open items and an empty field', async () => {
      await expect(todoListPage.items).toHaveCount(seedCount);
      await expect(todoListPage.newTodoField).toBeVisible();
      await expect(todoListPage.newTodoField).toHaveValue('');

      for (const name of practiceItems) {
        await expect.soft(todoListPage.item(name)).toHaveText(name);
        await expect.soft(todoListPage.item(name)).not.toHaveClass(/completed/);
        await expect.soft(todoListPage.item(name)).toHaveCSS('text-decoration-line', 'none');
      }
    });
  });

  test('entering a todo adds it to the list', { tag: ['@smoke', '@regression'] }, async ({ todoListPage }) => {
    const todo = 'Brew a potion';

    await test.step('the list starts with the practice items', async () => {
      await expect(todoListPage.items).toHaveCount(seedCount);
    });

    await test.step('enter a new todo', async () => {
      await todoListPage.addTodo(todo);
    });

    await test.step('the new item is in the list and the field is clear', async () => {
      await expect(todoListPage.items).toHaveCount(seedCount + 1);
      await expect(todoListPage.item(todo)).toHaveText(todo);
      await expect(todoListPage.newTodoField).toHaveValue('');

      for (const name of practiceItems) {
        await expect.soft(todoListPage.item(name)).toHaveText(name);
      }
    });
  });

  test('clicking an item strikes it through', { tag: ['@smoke', '@regression'] }, async ({ todoListPage }) => {
    const todo = 'Buy new robes';

    await test.step('the item starts open', async () => {
      await expect(todoListPage.items).toHaveCount(seedCount);
      await expect(todoListPage.item(todo)).not.toHaveClass(/completed/);
      await expect(todoListPage.item(todo)).toHaveCSS('text-decoration-line', 'none');
    });

    await test.step('click the item', async () => {
      await todoListPage.clickItem(todo);
    });

    await test.step('that item is struck through and the others stay open', async () => {
      await expect(todoListPage.item(todo)).toHaveClass(/completed/);
      await expect(todoListPage.item(todo)).toHaveCSS('text-decoration-line', 'line-through');
      await expect(todoListPage.item(todo)).toHaveCSS('color', completedColor);
      await expect(todoListPage.items).toHaveCount(seedCount);
      await expect.soft(todoListPage.item('Go to potion class')).not.toHaveClass(/completed/);
      await expect.soft(todoListPage.item('Go to potion class')).toHaveCSS('text-decoration-line', 'none');
      await expect.soft(todoListPage.item('Practice magic')).not.toHaveClass(/completed/);
      await expect.soft(todoListPage.item('Practice magic')).toHaveCSS('text-decoration-line', 'none');
    });
  });

  test('the delete control removes that item', { tag: ['@smoke', '@regression'] }, async ({ todoListPage }) => {
    const todo = 'Practice magic';

    await test.step('the delete control starts collapsed', async () => {
      await expect(todoListPage.deleteControl(todo)).toHaveCSS('width', '0px');
      await expect(todoListPage.deleteControl(todo)).toHaveCSS('opacity', '0');
    });

    await test.step('hovering the item opens its delete control', async () => {
      await todoListPage.hoverItem(todo);
      await expect(todoListPage.deleteControl(todo)).toHaveCSS('width', '40px');
      await expect(todoListPage.deleteControl(todo)).toHaveCSS('opacity', '1');
      await expect.soft(todoListPage.deleteControl('Go to potion class')).toHaveCSS('width', '0px');
      await expect.soft(todoListPage.deleteControl('Buy new robes')).toHaveCSS('width', '0px');
    });

    await test.step('clicking it removes the item', async () => {
      await todoListPage.removeItem(todo);
      await expect(todoListPage.item(todo)).toHaveCount(0);
      await expect(todoListPage.items).toHaveCount(seedCount - 1);
      await expect.soft(todoListPage.item('Go to potion class')).toHaveText('Go to potion class');
      await expect.soft(todoListPage.item('Buy new robes')).toHaveText('Buy new robes');
    });
  });

  test('enter on an empty field adds a blank item', { tag: ['@regression'] }, async ({ todoListPage }) => {
    await test.step('the field starts empty', async () => {
      await expect(todoListPage.newTodoField).toHaveValue('');
      await expect(todoListPage.items).toHaveCount(seedCount);
      await expect(todoListPage.blankItems).toHaveCount(0);
    });

    await test.step('press Enter', async () => {
      await todoListPage.addTodo('');
    });

    await test.step('a blank row is added and the practice items stay', async () => {
      await expect(todoListPage.items).toHaveCount(seedCount + 1);
      await expect(todoListPage.blankItems).toHaveCount(1);
      await expect(todoListPage.blankItems).toHaveText('');
      await expect(todoListPage.newTodoField).toHaveValue('');

      for (const name of practiceItems) {
        await expect.soft(todoListPage.item(name)).toHaveText(name);
      }
    });
  });

  test('clicking a completed item clears the strike-through', { tag: ['@regression'] }, async ({ todoListPage }) => {
    const todo = 'Buy new robes';

    await test.step('the first click strikes it through', async () => {
      await todoListPage.clickItem(todo);
      await expect(todoListPage.item(todo)).toHaveCSS('text-decoration-line', 'line-through');
    });

    await test.step('the second click clears it', async () => {
      await todoListPage.clickItem(todo);
      await expect(todoListPage.item(todo)).not.toHaveClass(/completed/);
      await expect(todoListPage.item(todo)).toHaveCSS('text-decoration-line', 'none');
      await expect(todoListPage.item(todo)).toHaveCSS('color', restingColor);
      await expect(todoListPage.items).toHaveCount(seedCount);
    });
  });

  test('the plus control toggles the add field', { tag: ['@regression'] }, async ({ todoListPage }) => {
    await test.step('the field starts visible', async () => {
      await expect(todoListPage.newTodoField).toBeVisible();
      await expect(todoListPage.items).toHaveCount(seedCount);
    });

    await test.step('plus hides the field and does not add an item', async () => {
      await todoListPage.toggleAddField();
      await expect(todoListPage.newTodoField).toBeHidden();
      await expect(todoListPage.items).toHaveCount(seedCount);
    });

    await test.step('plus shows the field again', async () => {
      await todoListPage.toggleAddField();
      await expect(todoListPage.newTodoField).toBeVisible();
      await expect(todoListPage.items).toHaveCount(seedCount);
    });
  });

  test('a todo with quotes and an ampersand is stored as text', { tag: ['@regression'] }, async ({ todoListPage }) => {
    const todo = 'Practice "magic" & potions';

    await test.step('enter the todo', async () => {
      await todoListPage.addTodo(todo);
    });

    await test.step('the list shows that text', async () => {
      await expect(todoListPage.items).toHaveCount(seedCount + 1);
      await expect(todoListPage.item(todo)).toHaveText(todo);
      await expect(todoListPage.newTodoField).toHaveValue('');
    });
  });
});
