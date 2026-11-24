import { test, expect } from '@/fixtures/base-test';

/**
 * Core on AI Testing Playground: iFrame Login, Shadow DOM Widget, Employee Directory,
 * File Upload Validator, and Priority Board.
 * The login form is only in #login-frame. Exact admin / secret123 succeeds.
 * The shadow widget is an open root on wdu-shadow-form. The directory filters and sorts in place.
 * Upload checks MIME and a 2 MB cap. The board uses HTML5 drag-and-drop.
 * The case list is specs/ai-testing-playground-core.plan.md.
 */

const playgroundUploadDir = 'test-data/ai-testing-playground';

const pngFile = `${playgroundUploadDir}/dot.png`;

const pdfFile = `${playgroundUploadDir}/note.pdf`;

const textFile = `${playgroundUploadDir}/notes.txt`;

const iframeSuccessMessage = 'Login successful';

const iframeErrorMessage = 'Invalid credentials';

const shadowEmptyMessage = 'Please enter a value.';

const noFileMessage = 'No file selected.';

const sarahMitchellRow = 'Sarah Mitchell Engineering £45,000 active 2019-03-15';

const engineeringCount = 5;

const allEmployeeCount = 15;

/**
 * Builds a PNG larger than the 2 MB upload limit.
 * @returns A file payload the input accepts as image/png
 */
function oversizedPng() {
  return {
    name: 'oversized.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1, 1),
  };
}

test.describe('AI Testing Playground', { tag: ['@ai-testing-playground', '@ai-testing-playground-core'] }, () => {
  test.beforeEach(async ({ aiTestingPlaygroundPage }) => {
    await aiTestingPlaygroundPage.navigateTo();
  });

  test.describe('iFrame Login', () => {
    test('a completed iframe login shows login successful', { tag: ['@smoke', '@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('admin and secret123 show the success line inside the frame', async () => {
        await aiTestingPlaygroundPage.logInThroughIframe('admin', 'secret123');
        await expect(aiTestingPlaygroundPage.iframeLoginResult).toHaveText(iframeSuccessMessage);
        await expect.soft(aiTestingPlaygroundPage.iframeUsernameField).toHaveValue('admin');
        await expect.soft(aiTestingPlaygroundPage.iframePasswordField).toHaveValue('secret123');
      });
    });

    test('a wrong iframe password shows invalid credentials', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('admin with a wrong password is rejected', async () => {
        await aiTestingPlaygroundPage.logInThroughIframe('admin', 'wrong');
        await expect(aiTestingPlaygroundPage.iframeLoginResult).toHaveText(iframeErrorMessage);
        await expect.soft(aiTestingPlaygroundPage.iframeUsernameField).toHaveValue('admin');
        await expect.soft(aiTestingPlaygroundPage.iframePasswordField).toHaveValue('wrong');
      });
    });

    test('an empty iframe login shows invalid credentials', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('empty fields are rejected', async () => {
        await aiTestingPlaygroundPage.logInThroughIframe('', '');
        await expect(aiTestingPlaygroundPage.iframeLoginResult).toHaveText(iframeErrorMessage);
      });
    });

    test('a wrong iframe username shows invalid credentials', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the right password with the wrong username is rejected', async () => {
        await aiTestingPlaygroundPage.logInThroughIframe('not-admin', 'secret123');
        await expect(aiTestingPlaygroundPage.iframeLoginResult).toHaveText(iframeErrorMessage);
        await expect.soft(aiTestingPlaygroundPage.iframeUsernameField).toHaveValue('not-admin');
      });
    });
  });

  test.describe('Shadow DOM Widget', () => {
    test('a shadow value is echoed', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Submit shows Echo plus the value', async () => {
        await aiTestingPlaygroundPage.submitShadowValue('playwright');
        await expect(aiTestingPlaygroundPage.shadowResult).toHaveText('Echo: playwright');
        await expect.soft(aiTestingPlaygroundPage.shadowValueField).toHaveValue('playwright');
      });
    });

    test('an empty shadow value asks for a value', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Submit with an empty field is rejected', async () => {
        await aiTestingPlaygroundPage.submitShadowForm();
        await expect(aiTestingPlaygroundPage.shadowResult).toHaveText(shadowEmptyMessage);
      });
    });

    test('whitespace-only shadow input asks for a value', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('spaces are trimmed and the empty message is shown', async () => {
        await aiTestingPlaygroundPage.submitShadowValue('   ');
        await expect(aiTestingPlaygroundPage.shadowResult).toHaveText(shadowEmptyMessage);
        await expect.soft(aiTestingPlaygroundPage.shadowValueField).toHaveValue('   ');
      });
    });
  });

  test.describe('Employee Directory', () => {
    test('filtering by department keeps matching rows', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Engineering leaves five Engineering rows', async () => {
        await aiTestingPlaygroundPage.filterEmployees('Engineering');
        const rows = aiTestingPlaygroundPage.employeeRows();
        await expect(rows).toHaveCount(engineeringCount);
        await expect(aiTestingPlaygroundPage.employeeRow(sarahMitchellRow)).toBeVisible();
        await expect.soft(aiTestingPlaygroundPage.employeeRow('Daniel Wright Engineering £55,000 active 2017-06-30')).toBeVisible();
        for (let index = 0; index < engineeringCount; index += 1) {
          await expect.soft(rows.nth(index)).toContainText('Engineering');
        }
      });
    });

    test('sorting by salary ascending puts the lowest first', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('the first Salary click sorts ascending', async () => {
        await aiTestingPlaygroundPage.sortEmployeesBySalary();
        await expect(aiTestingPlaygroundPage.employeeRows().first()).toContainText('Fiona Walsh');
        await expect(aiTestingPlaygroundPage.employeeRows().first()).toContainText('£28,000');
        await expect.soft(aiTestingPlaygroundPage.employeeSalarySortArrow).toHaveText(' ↑');
      });
    });

    test('sorting by salary descending puts the highest first', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('a second Salary click sorts descending', async () => {
        await aiTestingPlaygroundPage.sortEmployeesBySalary();
        await expect(aiTestingPlaygroundPage.employeeRows().first()).toContainText('Fiona Walsh');
        await aiTestingPlaygroundPage.sortEmployeesBySalary();
        await expect(aiTestingPlaygroundPage.employeeRows().first()).toContainText('Daniel Wright');
        await expect(aiTestingPlaygroundPage.employeeRows().first()).toContainText('£55,000');
        await expect.soft(aiTestingPlaygroundPage.employeeSalarySortArrow).toHaveText(' ↓');
      });
    });

    test('a filter with no matches clears the table', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('zzz-no-match leaves zero rows', async () => {
        await aiTestingPlaygroundPage.filterEmployees('zzz-no-match');
        await expect(aiTestingPlaygroundPage.employeeRows()).toHaveCount(0);
      });
    });

    test('clearing the filter restores every row', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Engineering narrows the table', async () => {
        await aiTestingPlaygroundPage.filterEmployees('Engineering');
        await expect(aiTestingPlaygroundPage.employeeRows()).toHaveCount(engineeringCount);
      });

      await test.step('clearing the filter restores fifteen rows', async () => {
        await aiTestingPlaygroundPage.clearEmployeeFilter();
        await expect(aiTestingPlaygroundPage.employeeRows()).toHaveCount(allEmployeeCount);
      });
    });

    test('a known employee row shows exact cells', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Sarah Mitchell has the expected cells', async () => {
        const row = aiTestingPlaygroundPage.employeeRow(sarahMitchellRow);
        await expect(row).toBeVisible();
        await expect.soft(row.locator('td').nth(0)).toHaveText('Sarah Mitchell');
        await expect.soft(row.locator('td').nth(1)).toHaveText('Engineering');
        await expect.soft(row.locator('td').nth(2)).toHaveText('£45,000');
        await expect.soft(row.locator('td').nth(3)).toHaveText('active');
        await expect.soft(row.locator('td').nth(4)).toHaveText('2019-03-15');
      });
    });
  });

  test.describe('File Upload Validator', () => {
    test('a valid png upload is accepted', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('dot.png is accepted with name, size, and type', async () => {
        await aiTestingPlaygroundPage.choosePlaygroundFile(pngFile);
        await aiTestingPlaygroundPage.submitPlaygroundFile();
        await expect(aiTestingPlaygroundPage.playgroundFileResult).toBeVisible();
        await expect(aiTestingPlaygroundPage.playgroundFileResult).toContainText('File accepted');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileResult).toContainText('Name: dot.png');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileResult).toContainText('Type: image/png');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileResult).toContainText('Size:');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileError).toBeHidden();
      });
    });

    test('validating with no file shows an error', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Validate & Upload with no file is rejected', async () => {
        await aiTestingPlaygroundPage.submitPlaygroundFile();
        await expect(aiTestingPlaygroundPage.playgroundFileError).toBeVisible();
        await expect(aiTestingPlaygroundPage.playgroundFileError).toHaveText(noFileMessage);
        await expect.soft(aiTestingPlaygroundPage.playgroundFileResult).toBeHidden();
      });
    });

    test('an invalid file type is rejected', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('notes.txt shows the invalid type error', async () => {
        await aiTestingPlaygroundPage.choosePlaygroundFile(textFile);
        await aiTestingPlaygroundPage.submitPlaygroundFile();
        await expect(aiTestingPlaygroundPage.playgroundFileError).toBeVisible();
        await expect(aiTestingPlaygroundPage.playgroundFileError).toContainText('Invalid file type:');
        await expect(aiTestingPlaygroundPage.playgroundFileError).toContainText('text/plain');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileError).toContainText('Only .jpg, .png, .pdf allowed.');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileResult).toBeHidden();
      });
    });

    test('a file over two megabytes is rejected', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('an oversized PNG shows the size error', async () => {
        await aiTestingPlaygroundPage.choosePlaygroundFile(oversizedPng());
        await aiTestingPlaygroundPage.submitPlaygroundFile();
        await expect(aiTestingPlaygroundPage.playgroundFileError).toBeVisible();
        await expect(aiTestingPlaygroundPage.playgroundFileError).toContainText('File too large:');
        await expect(aiTestingPlaygroundPage.playgroundFileError).toContainText('Maximum 2 MB');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileResult).toBeHidden();
      });
    });

    test('a valid pdf upload is accepted', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('note.pdf is accepted as application/pdf', async () => {
        await aiTestingPlaygroundPage.choosePlaygroundFile(pdfFile);
        await aiTestingPlaygroundPage.submitPlaygroundFile();
        await expect(aiTestingPlaygroundPage.playgroundFileResult).toBeVisible();
        await expect(aiTestingPlaygroundPage.playgroundFileResult).toContainText('File accepted');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileResult).toContainText('Name: note.pdf');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileResult).toContainText('Type: application/pdf');
        await expect.soft(aiTestingPlaygroundPage.playgroundFileError).toBeHidden();
      });
    });
  });

  test.describe('Priority Board', () => {
    test('dragging a task to in progress updates the board', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Fix login bug moves to In Progress', async () => {
        await aiTestingPlaygroundPage.moveTaskToColumn(aiTestingPlaygroundPage.fixLoginBugTask, aiTestingPlaygroundPage.inProgressColumn);
        await expect(aiTestingPlaygroundPage.boardResult).toHaveText('"Fix login bug" moved to In Progress');
        await expect(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.inProgressColumn)).toHaveCount(1);
        await expect(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.inProgressColumn)).toHaveText(['Fix login bug']);
        await expect
          .soft(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.backlogColumn))
          .toHaveText(['Write unit tests', 'Update docs']);
      });
    });

    test('the board starts with three backlog tasks', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('Backlog has three tasks and In Progress is empty', async () => {
        /**
         * This test does not drag. An empty In Progress check after a drag would pass for a different reason.
         */
        await expect(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.backlogColumn)).toHaveText([
          'Fix login bug',
          'Write unit tests',
          'Update docs',
        ]);
        await expect(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.inProgressColumn)).toHaveCount(0);
        await expect.soft(aiTestingPlaygroundPage.boardResult).toHaveText('');
      });
    });

    test('dragging a task back to backlog updates the result', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('move Fix login bug to In Progress', async () => {
        await aiTestingPlaygroundPage.moveTaskToColumn(aiTestingPlaygroundPage.fixLoginBugTask, aiTestingPlaygroundPage.inProgressColumn);
        await expect(aiTestingPlaygroundPage.boardResult).toHaveText('"Fix login bug" moved to In Progress');
      });

      await test.step('drag it back to Backlog', async () => {
        await aiTestingPlaygroundPage.moveTaskToColumn(aiTestingPlaygroundPage.fixLoginBugTask, aiTestingPlaygroundPage.backlogColumn);
        await expect(aiTestingPlaygroundPage.boardResult).toHaveText('"Fix login bug" moved to Backlog');
        await expect(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.inProgressColumn)).toHaveCount(0);
        await expect(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.backlogColumn)).toHaveCount(3);
        await expect.soft(aiTestingPlaygroundPage.backlogColumn.locator('#task-1')).toBeVisible();
      });
    });

    test('a second task can join in progress', { tag: ['@regression'] }, async ({ aiTestingPlaygroundPage }) => {
      await test.step('move Fix login bug to In Progress', async () => {
        await aiTestingPlaygroundPage.moveTaskToColumn(aiTestingPlaygroundPage.fixLoginBugTask, aiTestingPlaygroundPage.inProgressColumn);
        await expect(aiTestingPlaygroundPage.boardResult).toHaveText('"Fix login bug" moved to In Progress');
      });

      await test.step('Write unit tests joins In Progress', async () => {
        await aiTestingPlaygroundPage.moveTaskToColumn(
          aiTestingPlaygroundPage.writeUnitTestsTask,
          aiTestingPlaygroundPage.inProgressColumn,
        );
        await expect(aiTestingPlaygroundPage.boardResult).toHaveText('"Write unit tests" moved to In Progress');
        await expect(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.inProgressColumn)).toHaveText([
          'Fix login bug',
          'Write unit tests',
        ]);
        await expect.soft(aiTestingPlaygroundPage.tasksInColumn(aiTestingPlaygroundPage.backlogColumn)).toHaveText(['Update docs']);
      });
    });
  });
});
