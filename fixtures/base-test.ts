import { test as base } from '@playwright/test';

import { HomePage } from '@/pages/home-page';
import { ContactUsPage } from '@/pages/contact-us-page';
import { LoginPortalPage } from '@/pages/login-portal-page';
import { ButtonClicksPage } from '@/pages/button-clicks-page';
import { DropdownCheckboxRadioPage } from '@/pages/dropdown-checkbox-radio-page';
import { ActionsPage } from '@/pages/actions-page';
import { AjaxLoaderPage } from '@/pages/ajax-loader-page';
import { TodoListPage } from '@/pages/todo-list-page';

type MyFixtures = {
  homePage: HomePage;
  contactUsPage: ContactUsPage;
  loginPortalPage: LoginPortalPage;
  buttonClicksPage: ButtonClicksPage;
  dropdownCheckboxRadioPage: DropdownCheckboxRadioPage;
  actionsPage: ActionsPage;
  ajaxLoaderPage: AjaxLoaderPage;
  todoListPage: TodoListPage;
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
  ajaxLoaderPage: async ({ page }, use) => {
    const ajaxLoaderPage = new AjaxLoaderPage(page);
    await use(ajaxLoaderPage);
  },
  todoListPage: async ({ page }, use) => {
    const todoListPage = new TodoListPage(page);
    await use(todoListPage);
  },
});

export { expect } from '@playwright/test';
