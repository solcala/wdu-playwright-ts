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

  readonly movingTargetButton: Locator;

  readonly conditionalEmailField: Locator;
  readonly conditionalEmailError: Locator;
  readonly conditionalCodeField: Locator;
  readonly conditionalCodeError: Locator;
  readonly conditionalSubmitButton: Locator;
  readonly conditionalResult: Locator;

  readonly raceAButton: Locator;
  readonly raceBButton: Locator;
  readonly raceResult: Locator;

  readonly revealElementButton: Locator;
  readonly lazyMessage: Locator;
  readonly lazySelector: Locator;

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

    /**
     * Basics B: Moving Target, Conditional Validation, Race Condition, Lazy-Rendered Element.
     * Catch Me is the only button with that name. It is position absolute, and its left and top
     * change on a timer. The click shows the shared toast.
     */
    this.movingTargetButton = page.getByRole('button', { name: 'Catch Me', exact: true });

    /**
     * The Email caption is not tied to the control. The placeholder you@example.com is also on the
     * invisible-success field, so the id is the field. Valid email required appears on other
     * challenges, so the id is the error. The code field's placeholder is unique. A role lookup
     * skips it while the extra block is display:none. The placeholder still matches, and the tests
     * read the value in both states.
     * Submit is also on the multi-step form and the invisible-success form. The result line has no
     * role. Its text changes.
     */
    this.conditionalEmailField = page.locator('#cond-email');
    this.conditionalEmailError = page.locator('#cond-email-err');
    this.conditionalCodeField = page.getByPlaceholder('6-digit code', { exact: true });
    this.conditionalCodeError = page.getByText('Valid 6-digit code required', { exact: true });
    this.conditionalSubmitButton = page.locator('#cond-submit');
    this.conditionalResult = page.locator('#cond-result');

    this.raceAButton = page.getByRole('button', { name: 'Start Race A', exact: true });
    this.raceBButton = page.getByRole('button', { name: 'Start Race B', exact: true });
    /**
     * The result line has no role and no accessible name. The id is the locator.
     */
    this.raceResult = page.locator('#race-result');

    this.revealElementButton = page.getByRole('button', { name: 'Reveal Element', exact: true });
    /**
     * The sentence is in the page from the start, inside a display:none div. The text locator is the
     * paragraph. The click removes hidden from the div, which is what shows the sentence.
     * The code element has no accessible name. Its text is empty until the click.
     */
    this.lazyMessage = page.getByText('I just appeared!');
    this.lazySelector = page.locator('#lazy-selector');
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

  /**
   * Clicks Catch Me. The button moves on a timer. The click shows the toast.
   */
  async catchMovingTarget(): Promise<void> {
    await this.movingTargetButton.click();
  }

  /**
   * Returns the Catch Me button's left and top.
   * The button jumps on a timer. The strings are the inline offsets, such as `12px`.
   * @returns The left and top set on the button
   */
  async movingTargetOffset(): Promise<{ left: string; top: string }> {
    return this.movingTargetButton.evaluate((button) => ({
      left: button.style.left,
      top: button.style.top,
    }));
  }

  /**
   * Fills the conditional email field.
   * @param emailAddress - The email entered in the Email field
   */
  async fillConditionalEmail(emailAddress: string): Promise<void> {
    await this.conditionalEmailField.fill(emailAddress);
  }

  /**
   * Fills the verification code.
   * @param code - The code entered in the Verification code field
   */
  async fillConditionalCode(code: string): Promise<void> {
    await this.conditionalCodeField.fill(code);
  }

  /**
   * Clicks Submit on the conditional form.
   */
  async submitConditionalForm(): Promise<void> {
    await this.conditionalSubmitButton.click();
  }

  /**
   * Clicks Start Race A.
   */
  async startRaceA(): Promise<void> {
    await this.raceAButton.click();
  }

  /**
   * Clicks Start Race B.
   */
  async startRaceB(): Promise<void> {
    await this.raceBButton.click();
  }

  /**
   * Records every race result text from now on, including the current text.
   * A later poll can miss a line that was replaced before the next read.
   */
  async beginRaceResultLog(): Promise<void> {
    await this.raceResult.evaluate((result) => {
      const node = result as HTMLElement & { raceResultLog?: string[] };
      const log = [node.textContent ?? ''];
      const observer = new MutationObserver(() => {
        log.push(node.textContent ?? '');
      });
      observer.observe(node, { childList: true, characterData: true, subtree: true });
      node.raceResultLog = log;
    });
  }

  /**
   * Returns the race result lines recorded since beginRaceResultLog.
   * @returns The lines in order, including the text at the start of the record
   */
  async raceResultLog(): Promise<string[]> {
    return this.raceResult.evaluate((result) => {
      const log = (result as HTMLElement & { raceResultLog?: string[] }).raceResultLog;
      return log ? [...log] : [];
    });
  }

  /**
   * Returns the race result, and keeps a different line after the winner is cleared.
   * The win line is removed after 3 seconds. A later line is removed too, so an empty result on its own cannot show that the first winner held.
   * @param winner - The win line that should hold, such as `Race A won!`
   * @param replaced - Whether a different line has already been seen
   * @returns The next replaced flag, and `replaced` once another line has been named, otherwise the current text
   */
  async raceTextWhileWinnerHolds(winner: string, replaced: boolean): Promise<{ replaced: boolean; value: string }> {
    const text = await this.raceResult.innerText();
    const changed = replaced || (text !== winner && text !== '');
    return { replaced: changed, value: changed ? 'replaced' : text };
  }

  /**
   * Clicks Reveal Element.
   */
  async revealLazyElement(): Promise<void> {
    await this.revealElementButton.click();
  }
}
