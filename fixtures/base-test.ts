import { test as base } from '@playwright/test';

import { HomePage } from '@/pages/home-page';
import { ContactUsPage } from '@/pages/contact-us-page';
import { LoginPortalPage } from '@/pages/login-portal-page';
import { ButtonClicksPage } from '@/pages/button-clicks-page';

type MyFixtures = {
  homePage: HomePage;
  contactUsPage: ContactUsPage;
  loginPortalPage: LoginPortalPage;
  buttonClicksPage: ButtonClicksPage;
}

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

})

export { expect } from '@playwright/test';
