import { test, expect } from '@/fixtures/base-test';

/**
 * `fileSubmitted()` alerts, then the form submits.
 * The check is the file input's value length. Empty alerts `You need to select a file to upload!`.
 * Any chosen file alerts `Your file has now been uploaded!`. The script does not read the file.
 * The form has no action and no method, so the submit is a GET to this page.
 * The query is `filename` plus the chosen name. The bytes are not sent. The reload clears the input.
 * Chromium reports the chosen name as `C:\fakepath\` plus the file name.
 * Paths below are relative to the project root.
 * Enter on the file control opens the browser chooser, so it is not a test. Enter on Submit is.
 */

const notesFile = 'test-data/file-upload/notes.txt';
const emptyFile = 'test-data/file-upload/empty.txt';
const firstFile = 'test-data/file-upload/first.txt';
const secondFile = 'test-data/file-upload/second.txt';
const spacedNameFile = 'test-data/file-upload/quarterly report.txt';

const uploadedMessage = 'Your file has now been uploaded!';
const emptyMessage = 'You need to select a file to upload!';

test.describe('File Upload', { tag: ['@file-upload'] }, () => {
  test.beforeEach(async ({ fileUploadPage }) => {
    await fileUploadPage.navigateTo();
  });

  // The other tests submit. This is the empty form they start from.
  test('the upload form starts empty', { tag: ['@regression'] }, async ({ fileUploadPage }) => {
    await test.step('the page offers an empty file input and Submit', async () => {
      await expect.soft(fileUploadPage.page).toHaveTitle('File Upload');
      await expect.soft(fileUploadPage.heading).toBeVisible();
      await expect.soft(fileUploadPage.chooseFileHeading).toBeVisible();
      await expect.soft(fileUploadPage.fileInput).toBeEmpty();
      await expect.soft(fileUploadPage.fileInput).toBeEnabled();
      await expect.soft(fileUploadPage.submitButton).toBeEnabled();
    });
  });

  test.describe('Submit', () => {
    // The only success path: a chosen name, the uploaded alert, and that name in the query.
    test('submitting a chosen file shows it was uploaded', { tag: ['@smoke', '@regression'] }, async ({ fileUploadPage }) => {
      await test.step('choose notes.txt', async () => {
        await fileUploadPage.chooseFile(notesFile);
        await expect(fileUploadPage.fileInput).toHaveValue('C:\\fakepath\\notes.txt');
      });

      await test.step('submit reports notes.txt and reloads without it', async () => {
        const message = await fileUploadPage.submitFile();
        expect.soft(message).toBe(uploadedMessage);
        await expect.soft(fileUploadPage.page).toHaveURL(/\/File-Upload\/index\.html\?filename=notes\.txt$/);
        await expect.soft(fileUploadPage.fileInput).toBeEmpty();
        await expect.soft(fileUploadPage.page).toHaveTitle('File Upload');
      });
    });

    // Submit is a submit input. Enter on it runs the same click handler.
    test('pressing Enter on Submit uploads the chosen file', { tag: ['@regression'] }, async ({ fileUploadPage }) => {
      await test.step('choose notes.txt', async () => {
        await fileUploadPage.chooseFile(notesFile);
        await expect(fileUploadPage.fileInput).toHaveValue('C:\\fakepath\\notes.txt');
      });

      await test.step('Enter on Submit reports notes.txt', async () => {
        const message = await fileUploadPage.submitFileWithEnter();
        expect.soft(message).toBe(uploadedMessage);
        await expect.soft(fileUploadPage.page).toHaveURL(/\/File-Upload\/index\.html\?filename=notes\.txt$/);
      });
    });

    test.describe('Negative path', () => {
      // value.length == 0. The success test would still pass if this alert were the uploaded one.
      test('submitting with no file asks for a file', { tag: ['@regression'] }, async ({ fileUploadPage }) => {
        await test.step('submit asks for a file', async () => {
          const message = await fileUploadPage.submitFile();
          expect.soft(message).toBe(emptyMessage);
          await expect.soft(fileUploadPage.page).toHaveURL(/\/File-Upload\/index\.html\?filename=$/);
          await expect.soft(fileUploadPage.fileInput).toBeEmpty();
          await expect.soft(fileUploadPage.page).toHaveTitle('File Upload');
        });
      });
    });

    test.describe('Edge cases', () => {
      // The check is the path string, not the file size. This file is 0 bytes.
      test('a zero-byte file is reported as uploaded', { tag: ['@regression'] }, async ({ fileUploadPage }) => {
        await test.step('choose empty.txt', async () => {
          await fileUploadPage.chooseFile(emptyFile);
          await expect(fileUploadPage.fileInput).toHaveValue('C:\\fakepath\\empty.txt');
        });

        await test.step('submit reports empty.txt', async () => {
          const message = await fileUploadPage.submitFile();
          expect.soft(message).toBe(uploadedMessage);
          await expect.soft(fileUploadPage.page).toHaveURL(/\/File-Upload\/index\.html\?filename=empty\.txt$/);
        });
      });

      // The check reads the current value. The first name must not leak into the query.
      test('submitting the latest chosen file uses that name', { tag: ['@regression'] }, async ({ fileUploadPage }) => {
        await test.step('choose first.txt, then second.txt', async () => {
          await fileUploadPage.chooseFile(firstFile);
          await fileUploadPage.chooseFile(secondFile);
          await expect(fileUploadPage.fileInput).toHaveValue('C:\\fakepath\\second.txt');
        });

        await test.step('submit reports second.txt', async () => {
          const message = await fileUploadPage.submitFile();
          expect.soft(message).toBe(uploadedMessage);
          await expect.soft(fileUploadPage.page).toHaveURL(/\/File-Upload\/index\.html\?filename=second\.txt$/);
        });
      });

      // Clearing is the way back to length 0 after a file was chosen.
      test('clearing the chosen file asks for a file', { tag: ['@regression'] }, async ({ fileUploadPage }) => {
        await test.step('choose notes.txt and clear it', async () => {
          await fileUploadPage.chooseFile(notesFile);
          await fileUploadPage.clearChosenFile();
          await expect(fileUploadPage.fileInput).toBeEmpty();
        });

        await test.step('submit asks for a file', async () => {
          const message = await fileUploadPage.submitFile();
          expect.soft(message).toBe(emptyMessage);
          await expect.soft(fileUploadPage.page).toHaveURL(/\/File-Upload\/index\.html\?filename=$/);
        });
      });

      // A space in the name is form-encoded as + in the query.
      test('a filename with a space is submitted in the query', { tag: ['@regression'] }, async ({ fileUploadPage }) => {
        await test.step('choose quarterly report.txt', async () => {
          await fileUploadPage.chooseFile(spacedNameFile);
          await expect(fileUploadPage.fileInput).toHaveValue('C:\\fakepath\\quarterly report.txt');
        });

        await test.step('submit encodes the space', async () => {
          const message = await fileUploadPage.submitFile();
          expect.soft(message).toBe(uploadedMessage);
          await expect.soft(fileUploadPage.page).toHaveURL(/\/File-Upload\/index\.html\?filename=quarterly\+report\.txt$/);
        });
      });
    });
  });
});
