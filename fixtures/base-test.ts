import { test as base } from '@playwright/test';

import { HomePage } from '@/pages/home-page';
import { ContactUsPage } from '@/pages/contact-us-page';

type MyFixtures = {
  homePage: HomePage;
  contactUsPage: ContactUsPage;
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

})

export { expect } from '@playwright/test';
