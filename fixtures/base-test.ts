import { test as base } from '@playwright/test';

import { HomePage } from '@/pages/home-page';
import { ContactUsPage } from '@/pages/contact-us-page';
import { LoginPortalPage } from '@/pages/login-portal-page';
import { ButtonClicksPage } from '@/pages/button-clicks-page';
import { DropdownCheckboxRadioPage } from '@/pages/dropdown-checkbox-radio-page';
import { ActionsPage } from '@/pages/actions-page';
import { IframePage } from '@/pages/iframe-page';
import { AjaxLoaderPage } from '@/pages/ajax-loader-page';
import { AutocompletePage } from '@/pages/autocomplete-page';
import { PopupAlertsPage } from '@/pages/popup-alerts-page';
import { FileUploadPage } from '@/pages/file-upload-page';
import { TodoListPage } from '@/pages/todo-list-page';
import { HiddenElementsPage } from '@/pages/hidden-elements-page';

type MyFixtures = {
  homePage: HomePage;
  contactUsPage: ContactUsPage;
  loginPortalPage: LoginPortalPage;
  buttonClicksPage: ButtonClicksPage;
  dropdownCheckboxRadioPage: DropdownCheckboxRadioPage;
  actionsPage: ActionsPage;
  iframePage: IframePage;
  ajaxLoaderPage: AjaxLoaderPage;
  autocompletePage: AutocompletePage;
  popupAlertsPage: PopupAlertsPage;
  fileUploadPage: FileUploadPage;
  todoListPage: TodoListPage;
  hiddenElementsPage: HiddenElementsPage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  contactUsPage: async ({ page }, use) => {
    const contactUsPage = new ContactUsPage(page);
    await use(contactUsPage);
  },
  loginPortalPage: async ({ page }, use) => {
    const loginPortalPage = new LoginPortalPage(page);
    await use(loginPortalPage);
  },
  buttonClicksPage: async ({ page }, use) => {
    const buttonClicksPage = new ButtonClicksPage(page);
    await use(buttonClicksPage);
  },
  dropdownCheckboxRadioPage: async ({ page }, use) => {
    const dropdownCheckboxRadioPage = new DropdownCheckboxRadioPage(page);
    await use(dropdownCheckboxRadioPage);
  },
  actionsPage: async ({ page }, use) => {
    const actionsPage = new ActionsPage(page);
    await use(actionsPage);
  },
  iframePage: async ({ page }, use) => {
    const iframePage = new IframePage(page);
    await use(iframePage);
  },
  ajaxLoaderPage: async ({ page }, use) => {
    const ajaxLoaderPage = new AjaxLoaderPage(page);
    await use(ajaxLoaderPage);
  },
  autocompletePage: async ({ page }, use) => {
    const autocompletePage = new AutocompletePage(page);
    await use(autocompletePage);
  },
  popupAlertsPage: async ({ page }, use) => {
    const popupAlertsPage = new PopupAlertsPage(page);
    await use(popupAlertsPage);
  },
  fileUploadPage: async ({ page }, use) => {
    const fileUploadPage = new FileUploadPage(page);
    await use(fileUploadPage);
  },
  todoListPage: async ({ page }, use) => {
    const todoListPage = new TodoListPage(page);
    await use(todoListPage);
  },
  hiddenElementsPage: async ({ page }, use) => {
    const hiddenElementsPage = new HiddenElementsPage(page);
    await use(hiddenElementsPage);
  },
});

export { expect } from '@playwright/test';
