import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class FileUploadPage extends BasePage {
  readonly path = '/File-Upload/index.html';
  readonly heading: Locator;
  readonly chooseFileHeading: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'File Upload', exact: true });
    this.chooseFileHeading = page.getByRole('heading', { name: 'Please choose a file to upload:' });
    /**
     * The file control has no label. Chromium exposes it as a button named Choose File.
     * That name stays Choose File after a file is chosen.
     */
    this.fileInput = page.getByRole('button', { name: 'Choose File', exact: true });
    /**
     * The submit input has no value attribute. Its accessible name is Submit.
     */
    this.submitButton = page.getByRole('button', { name: 'Submit', exact: true });
  }

  /**
   * Chooses one file in the file input.
   * @param file - Path to the file, relative to the project root
   */
  async chooseFile(file: string): Promise<void> {
    await this.fileInput.setInputFiles(file);
  }

  /**
   * Clears the chosen file.
   */
  async clearChosenFile(): Promise<void> {
    await this.fileInput.setInputFiles([]);
  }

  /**
   * Clicks Submit and accepts the alert the page shows.
   * The listener is registered before the click, because the alert is gone if nothing is listening.
   * @returns The alert message text
   */
  async submitFile(): Promise<string> {
    return this.acceptSubmitAlert(() => this.submitButton.click());
  }

  /**
   * Presses Enter on Submit and accepts the alert the page shows.
   * The listener is registered before the keypress, because the alert is gone if nothing is listening.
   * @returns The alert message text
   */
  async submitFileWithEnter(): Promise<string> {
    return this.acceptSubmitAlert(() => this.submitButton.press('Enter'));
  }

  /**
   * Runs the submit action and accepts the alert it opens.
   * The listener is registered before the action, because the alert is gone if nothing is listening.
   * @param trigger - The click or keypress that submits the form
   * @returns The alert message text
   */
  private async acceptSubmitAlert(trigger: () => Promise<void>): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog');
    const actionPromise = trigger();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    await actionPromise;
    return message;
  }
}
