import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page';

export class AiTestingPlaygroundPage extends BasePage {
  readonly path = '/AI-Playground/index.html';

  readonly dynamicLoginCard: Locator;
  readonly dynamicUsernameField: Locator;
  readonly dynamicPasswordField: Locator;
  readonly dynamicLoginButton: Locator;
  readonly dynamicErrorMessage: Locator;
  readonly dynamicSuccessMessage: Locator;

  readonly flakyLoadButton: Locator;
  readonly flakyLoadingMessage: Locator;
  readonly flakySuccessMessage: Locator;
  readonly flakyActionButton: Locator;

  readonly stepIndicator: Locator;
  readonly nameStep: Locator;
  readonly fullNameField: Locator;
  readonly emailAddressField: Locator;
  readonly fullNameError: Locator;
  readonly emailAddressError: Locator;
  readonly nameStepNextButton: Locator;
  readonly countryStep: Locator;
  readonly countryDropdown: Locator;
  readonly phoneField: Locator;
  readonly countryError: Locator;
  readonly countryStepBackButton: Locator;
  readonly countryStepNextButton: Locator;
  readonly termsStep: Locator;
  readonly commentsField: Locator;
  readonly termsCheckbox: Locator;
  readonly termsError: Locator;
  readonly multiStepSubmitButton: Locator;
  readonly submittedStep: Locator;
  readonly multiStepSuccessMessage: Locator;

  readonly triggerToastButton: Locator;
  readonly toast: Locator;

  readonly reEnableButton: Locator;
  readonly reEnableStatus: Locator;

  constructor(page: Page) {
    super(page);

    /**
     * Basics A: Dynamic Selectors, Flaky Loader, Multi-Step Form, Auto-Dismiss Toast, Re-Enable Delay.
     * The login controls are rebuilt on each load with new classes. The card test id does not change.
     * Username and Password are the placeholders, and they are the accessible names. The Login button
     * is scoped to the card because the session challenge has another Login button.
     */
    this.dynamicLoginCard = page.getByTestId('dynamic-login-card');
    this.dynamicUsernameField = this.dynamicLoginCard.getByRole('textbox', { name: 'Username' });
    this.dynamicPasswordField = this.dynamicLoginCard.getByRole('textbox', { name: 'Password' });
    this.dynamicLoginButton = this.dynamicLoginCard.getByRole('button', { name: 'Login', exact: true });
    this.dynamicErrorMessage = this.dynamicLoginCard.getByText('Invalid credentials', { exact: true });
    this.dynamicSuccessMessage = this.dynamicLoginCard.getByText('Login successful', { exact: true });

    this.flakyLoadButton = page.getByRole('button', { name: 'Load Content', exact: true });
    /**
     * The loading line and the success line are in the page from the start, hidden with display:none.
     * The success text is unique. Loading... is unique.
     */
    this.flakyLoadingMessage = page.getByText('Loading...', { exact: true });
    this.flakySuccessMessage = page.getByText('Content loaded successfully!', { exact: true });
    /**
     * Click Me Now sits inside the hidden content. A role lookup skips it until that content is shown,
     * so the id is the button in both states. Its accessible name is Click Me Now.
     */
    this.flakyActionButton = page.locator('#flaky-action');

    /**
     * The multi-step widget is a div, not a form. The same placeholders and the words Next, Back, and Submit
     * appear on other challenges. Each step id is the scope. A hidden step stays in the page, and the two
     * Next buttons share a name, so each button is found inside its step.
     * The Full name, Email, and Country captions are not tied to the controls. The placeholder or the
     * step is what identifies the control. The Country menu is the only combobox in its step.
     */
    this.stepIndicator = page.locator('#step-text');
    this.nameStep = page.locator('#step-1');
    this.fullNameField = this.nameStep.getByRole('textbox', { name: 'Jane Doe' });
    this.emailAddressField = this.nameStep.getByRole('textbox', { name: 'jane@example.com' });
    this.fullNameError = this.nameStep.getByText('Full name required (first and last)', { exact: true });
    this.emailAddressError = this.nameStep.getByText('Valid email required', { exact: true });
    this.nameStepNextButton = this.nameStep.getByRole('button', { name: 'Next', exact: true });
    this.countryStep = page.locator('#step-2');
    this.countryDropdown = this.countryStep.getByRole('combobox');
    this.phoneField = this.countryStep.getByRole('textbox', { name: '+44 7700 000000' });
    this.countryError = this.countryStep.getByText('Country is required', { exact: true });
    this.countryStepBackButton = this.countryStep.getByRole('button', { name: 'Back', exact: true });
    this.countryStepNextButton = this.countryStep.getByRole('button', { name: 'Next', exact: true });
    this.termsStep = page.locator('#step-3');
    this.commentsField = this.termsStep.getByRole('textbox', { name: 'Optional' });
    this.termsCheckbox = this.termsStep.getByRole('checkbox', { name: 'I accept the terms and conditions' });
    this.termsError = this.termsStep.getByText('You must accept the terms', { exact: true });
    this.multiStepSubmitButton = this.termsStep.getByRole('button', { name: 'Submit', exact: true });
    this.submittedStep = page.locator('#step-done');
    this.multiStepSuccessMessage = this.submittedStep.getByText('Form submitted successfully.', { exact: true });

    this.triggerToastButton = page.getByRole('button', { name: 'Trigger Toast', exact: true });
    /**
     * The toast is a div with no role. Its text changes, and opacity is what shows and hides it.
     * The id is the locator.
     */
    this.toast = page.locator('#toast');

    /**
     * Click Me is exact because Click Me Now contains that text.
     * The status line has no role and no accessible name. The id is the locator.
     */
    this.reEnableButton = page.getByRole('button', { name: 'Click Me', exact: true });
    this.reEnableStatus = page.locator('#reenable-status');
  }

  /**
   * Fills the dynamic login fields and clicks Login.
   * @param username - The username entered in the Username field
   * @param password - The password entered in the Password field
   */
  async logIn(username: string, password: string): Promise<void> {
    await this.dynamicUsernameField.fill(username);
    await this.dynamicPasswordField.fill(password);
    await this.dynamicLoginButton.click();
  }

  /**
   * Clicks Load Content. The success line appears after a delay.
   */
  async loadFlakyContent(): Promise<void> {
    await this.flakyLoadButton.click();
  }

  /**
   * Clicks Click Me Now. That shows the flaky-action toast.
   */
  async clickFlakyAction(): Promise<void> {
    await this.flakyActionButton.click();
  }

  /**
   * Fills the name and email on the first step.
   * @param fullName - The name entered in the Full name field
   * @param emailAddress - The email entered in the Email field
   */
  async fillNameStep(fullName: string, emailAddress: string): Promise<void> {
    await this.fullNameField.fill(fullName);
    await this.emailAddressField.fill(emailAddress);
  }

  /**
   * Clicks Next on the name step.
   */
  async continueFromNameStep(): Promise<void> {
    await this.nameStepNextButton.click();
  }

  /**
   * Chooses a country and fills the phone on the country step.
   * @param country - The country label chosen in the Country menu
   * @param phone - The phone entered in the Phone field
   */
  async fillCountryStep(country: string, phone: string): Promise<void> {
    await this.countryDropdown.selectOption({ label: country });
    await this.phoneField.fill(phone);
  }

  /**
   * Clicks Next on the country step.
   */
  async continueFromCountryStep(): Promise<void> {
    await this.countryStepNextButton.click();
  }

  /**
   * Clicks Back on the country step.
   */
  async backToNameStep(): Promise<void> {
    await this.countryStepBackButton.click();
  }

  /**
   * Checks the terms checkbox.
   */
  async acceptTerms(): Promise<void> {
    await this.termsCheckbox.check();
  }

  /**
   * Clicks Submit on the terms step.
   */
  async submitMultiStepForm(): Promise<void> {
    await this.multiStepSubmitButton.click();
  }

  /**
   * Clicks Trigger Toast.
   */
  async triggerToast(): Promise<void> {
    await this.triggerToastButton.click();
  }

  /**
   * Clicks Click Me on the re-enable challenge.
   */
  async clickReEnableButton(): Promise<void> {
    await this.reEnableButton.click();
  }
}
