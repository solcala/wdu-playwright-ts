import { test, expect } from '@/fixtures/base-test';

/**
 * The two name tables share their headers. Jackson is in both, and Jones is also in the Table section.
 * Warning has the disabled class and pointer-events none, and the disabled property is false. Space still clicks it.
 * Button-1 starts active. Reset sits outside the name form, and Enter does not add a row.
 * The case list is specs/data-tables.plan.md.
 */

const headerRow = 1;
const firstTableRows = ['John Smith 45', 'Jemma Jackson 94', 'Michael Doe 20'];
const secondTableRows = ['Jason Jones 27', 'Sarah Jackson 56', 'Bob Woods 80'];
const traversalRows = ['1 Andy Otto', '2 Jacob Jones', '3 Larry Scott'];
const nameHeaders = ['Firstname', 'Lastname', 'Age'];
const traversalHeaders = ['#', 'First', 'Last'];

test.describe('Data Tables', { tag: ['@data-tables'] }, () => {
  test.beforeEach(async ({ dataTablesPage }) => {
    await dataTablesPage.navigateTo();
  });

  test('the first table lists John, Jemma, and Michael', { tag: ['@smoke', '@regression'] }, async ({ dataTablesPage }) => {
    await test.step('three people and their ages', async () => {
      await expect(dataTablesPage.firstNamesTable.getByRole('row')).toHaveCount(headerRow + firstTableRows.length);

      for (const name of firstTableRows) {
        await expect.soft(dataTablesPage.row(dataTablesPage.firstNamesTable, name)).toHaveCount(1);
      }

      for (const header of nameHeaders) {
        await expect.soft(dataTablesPage.firstNamesTable.getByRole('columnheader', { name: header, exact: true })).toBeVisible();
      }
    });
  });

  test('the second table lists Jason, Sarah, and Bob', { tag: ['@regression'] }, async ({ dataTablesPage }) => {
    await test.step('a different three people under the same headers', async () => {
      await expect(dataTablesPage.secondNamesTable.getByRole('row')).toHaveCount(headerRow + secondTableRows.length);

      for (const name of secondTableRows) {
        await expect.soft(dataTablesPage.row(dataTablesPage.secondNamesTable, name)).toHaveCount(1);
      }

      await expect.soft(dataTablesPage.row(dataTablesPage.secondNamesTable, 'Jemma Jackson 94')).toHaveCount(0);
      await expect.soft(dataTablesPage.row(dataTablesPage.secondNamesTable, 'John Smith 45')).toHaveCount(0);

      for (const header of nameHeaders) {
        await expect.soft(dataTablesPage.secondNamesTable.getByRole('columnheader', { name: header, exact: true })).toBeVisible();
      }
    });
  });

  test('the table section lists Andy, Jacob, and Larry', { tag: ['@regression'] }, async ({ dataTablesPage }) => {
    await test.step('three numbered rows', async () => {
      await expect(dataTablesPage.traversalTable.getByRole('row')).toHaveCount(headerRow + traversalRows.length);

      for (const name of traversalRows) {
        await expect.soft(dataTablesPage.row(dataTablesPage.traversalTable, name)).toHaveCount(1);
      }

      for (const header of traversalHeaders) {
        await expect.soft(dataTablesPage.traversalTable.getByRole('columnheader', { name: header, exact: true })).toBeVisible();
      }
    });
  });

  test('a pointer click misses the warning button', { tag: ['@smoke', '@regression'] }, async ({ dataTablesPage }) => {
    await test.step('warning is enabled and ignores the pointer', async () => {
      await expect(dataTablesPage.warningButton).toBeVisible();
      await expect(dataTablesPage.warningButton).toBeEnabled();
      await expect(dataTablesPage.warningButton).toHaveClass(/disabled/);
      await expect(dataTablesPage.warningButton).toHaveCSS('pointer-events', 'none');
      await expect(dataTablesPage.warningButton).toHaveCSS('opacity', '0.65');
    });

    await test.step('the click lands on the group behind the button', async () => {
      const hit = await dataTablesPage.clickWarningButton();
      expect(hit.tag).toBe('DIV');
      expect(hit.className).toBe('traversal-button-states');
      await expect(dataTablesPage.warningButton).toHaveClass(/disabled/);
    });

    await test.step('the other outline buttons still take the pointer', async () => {
      await expect.soft(dataTablesPage.dangerButton).toBeEnabled();
      await expect.soft(dataTablesPage.dangerButton).toHaveCSS('pointer-events', 'auto');
      await expect.soft(dataTablesPage.infoButton).toBeEnabled();
      await expect.soft(dataTablesPage.infoButton).toHaveCSS('pointer-events', 'auto');
      await expect.soft(dataTablesPage.alertButton).toBeEnabled();
      await expect.soft(dataTablesPage.alertButton).toHaveCSS('pointer-events', 'auto');
    });
  });

  test('space activates the warning button', { tag: ['@regression'] }, async ({ dataTablesPage }) => {
    await test.step('warning is in the tab order', async () => {
      await dataTablesPage.warningButton.focus();
      await expect(dataTablesPage.warningButton).toBeFocused();
      await expect(dataTablesPage.warningButton).toBeEnabled();
      await expect(dataTablesPage.warningButton).toHaveCSS('pointer-events', 'none');
    });

    await test.step('space clicks the button', async () => {
      const hit = await dataTablesPage.pressWarningButton('Space');
      expect(hit.tag).toBe('BUTTON');
      expect(hit.className).toBe('btn btn-outline-warning disabled');
      await expect.soft(dataTablesPage.warningButton).toBeFocused();
    });
  });

  test('clicking button 2 leaves button 1 active', { tag: ['@regression'] }, async ({ dataTablesPage }) => {
    await test.step('button 1 starts active', async () => {
      await expect(dataTablesPage.button1).toHaveClass(/active/);
      await expect(dataTablesPage.button2).not.toHaveClass(/active/);
    });

    await test.step('click button 2', async () => {
      await dataTablesPage.clickButton2();
    });

    await test.step('button 1 stays the active one', async () => {
      await expect(dataTablesPage.button1).toHaveClass(/active/);
      await expect(dataTablesPage.button2).not.toHaveClass(/active/);
      await expect.soft(dataTablesPage.button3).not.toHaveClass(/active/);
      await expect.soft(dataTablesPage.button4).not.toHaveClass(/active/);
    });
  });

  test('reset does not clear the form', { tag: ['@regression'] }, async ({ dataTablesPage }) => {
    const firstName = 'Ada';
    const lastName = 'Lovelace';
    const text = 'notes';

    await test.step('the name fields start empty', async () => {
      await expect(dataTablesPage.firstNameField).toHaveValue('');
      await expect(dataTablesPage.lastNameField).toHaveValue('');
    });

    await test.step('fill the form and click reset', async () => {
      await dataTablesPage.fillForm(firstName, lastName, text);
      await expect(dataTablesPage.firstNameField).toHaveValue(firstName);
      await expect(dataTablesPage.lastNameField).toHaveValue(lastName);
      await expect(dataTablesPage.inputTextField).toHaveValue(text);
      await dataTablesPage.clickReset();
    });

    await test.step('the typed values stay', async () => {
      await expect(dataTablesPage.firstNameField).toHaveValue(firstName);
      await expect.soft(dataTablesPage.lastNameField).toHaveValue(lastName);
      await expect.soft(dataTablesPage.inputTextField).toHaveValue(text);
    });
  });

  test('entering names does not add a table row', { tag: ['@regression'] }, async ({ dataTablesPage }) => {
    const firstName = 'Ada';
    const lastName = 'Lovelace';

    await test.step('the first table has its three people', async () => {
      await expect(dataTablesPage.firstNamesTable.getByRole('row')).toHaveCount(headerRow + firstTableRows.length);
      await expect(dataTablesPage.firstNamesTable.getByRole('row', { name: firstName })).toHaveCount(0);
    });

    await test.step('enter a first and last name', async () => {
      await dataTablesPage.enterNames(firstName, lastName);
    });

    await test.step('the table has no new row', async () => {
      await expect(dataTablesPage.firstNamesTable.getByRole('row')).toHaveCount(headerRow + firstTableRows.length);
      await expect(dataTablesPage.firstNamesTable.getByRole('row', { name: firstName })).toHaveCount(0);
      await expect(dataTablesPage.secondNamesTable.getByRole('row', { name: firstName })).toHaveCount(0);
      await expect.soft(dataTablesPage.page).toHaveURL(dataTablesPage.path);
      await expect.soft(dataTablesPage.firstNameField).toHaveValue(firstName);
      await expect.soft(dataTablesPage.lastNameField).toHaveValue(lastName);
    });
  });
});
