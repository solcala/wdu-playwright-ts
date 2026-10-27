# AGENTS.md

Playwright Test + TypeScript end-to-end suite for [WebdriverUniversity](https://webdriveruniversity.com). Portfolio project: code is reviewed as if a hiring manager reads it.

Owner: [@solcala](https://github.com/solcala). If a rule here seems wrong, ask the owner instead of working around it. When you change a rule here, update `.cursor/rules/playwright-tests.mdc` in the same change.

## Commands

| Command | Use |
| --- | --- |
| `npm run check` | Lint, typecheck, and tests. Run before saying a change is done |
| `npm run lint` | ESLint with `eslint-plugin-playwright` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | `playwright test`, the whole suite |
| `npx playwright test tests/<name>.spec.ts` | One spec |
| `npx playwright test --grep @smoke` | Smoke subset |

After changing one spec or page object, run that spec first for fast feedback, then `npm run check` before reporting done.

The Husky pre-commit hook runs `npm run check`. Never suggest `--no-verify`.

## Layout

- `pages/` — page objects. `base-page.ts` is the abstract `BasePage` (`page`, `path`, `navigateTo()`). See `pages/home-page.ts`.
- `fixtures/base-test.ts` — `test.extend` with one fixture per page object.
- `tests/` — `*.spec.ts`. `bot-wall.setup.ts` runs first (setup project).
- `support/` — helpers that never import or call `test` or `expect` (rule 1). `bot-wall.ts` handles the site's browser check.
- `playwright.config.ts` — `baseURL`, projects, reporters.

## Naming

- Name a page after its title on the site. The class is that name plus `Page`; the file is the class in kebab-case; the fixture is the class in camelCase; the spec drops `Page`. "Login Portal" → `LoginPortalPage`, `pages/login-portal-page.ts`, `loginPortalPage`, `tests/login-portal.spec.ts`. Existing: `ContactUsPage`, `pages/contact-us-page.ts`, `contactUsPage`, `tests/contact-us.spec.ts`.
- One PascalCase class per page file.
- Locator properties describe the element: `submitButton`, `emailAddressField`, `successMessage`.
- Imports use the `@/` alias, never relative paths: `import { BasePage } from '@/pages/base-page'`.

## Test code rules

1. `test` and `expect` are called only in `*.spec.ts`, `*.setup.ts`, and `fixtures/base-test.ts`. Page objects and `support/` never import or call them; they may import types such as `Page` and `Locator`.
2. Page objects expose locators and actions. They return values; the spec asserts.
3. Specs import `test` and `expect` from `@/fixtures/base-test`, never from `@playwright/test`.
4. `fixtures/base-test.ts` is the only file that imports `test` and `expect` from `@playwright/test`. It extends `test` and re-exports both.
5. A new page object gets a fixture in `fixtures/base-test.ts`. Specs use the fixture, never `new SomePage(page)`.
6. Every wait names the condition: web-first `expect`, `waitForURL`, `waitForResponse`, `locator.waitFor()`. A reviewer should be able to name the condition from the line alone. Never `waitForTimeout`.
7. Group checks with `test.step`. Use plain `expect` for a check that must pass before the test can continue, and `expect.soft` for independent checks in one test.
8. Tag tests `@smoke` and/or `@regression`.
9. One behavior per test. Tests do not depend on each other's order or state.

## Locators

Prefer, in order: `getByRole` with `name` → `getByLabel` / `getByPlaceholder` → `getByText` → CSS or id only when nothing above is unambiguous. No XPath. Never select by generated classes or index unless the page gives no other option; say why in a comment.

## When to ask

Stop and ask the human before continuing if any of these apply:

- A locator matches more than one element, or none, and no option in "Locators" is unambiguous.
- A wait condition is unclear, or the only fix you can see is a timeout or a retry.
- A test fails and the cause could be the product, the bot wall, or the test. Say which one you think it is and ask before changing the assertion.
- The change needs a new dependency, or a change to `playwright.config.ts`, CI, or Docker.
- The change would modify `BasePage`, an existing fixture, or `support/`. Adding one fixture for a new page (rule 5) does not count; changing an existing fixture does.
- Two rules in this file seem to conflict. Name both and ask which one applies.

How to ask:

- Give the question, the options you see, and your recommendation. Do not guess and continue.
- If no human can answer (CI, cloud, or review agents), stop and report the question instead of guessing.

## Site browser check (bot wall)

The site runs SiteGround's "Robot Challenge Screen". `tests/bot-wall.setup.ts` passes it once and saves `playwright/.auth/site.json`; the `chromium` project reuses that state.

- Never skip, fake, intercept, or route around the challenge.
- A `BotWallError` is an environment failure, not a product bug. Report it; do not "fix" the test.

## Do not

- `test.only`, `test.skip`, or `test.fixme` to make a run green
- Weaken, remove, or loosen an assertion to make a test pass
- Raise a timeout instead of finding the condition to wait for
- Add `maxFailures` to stop a run early. It stops on any failure and hides the rest of the report
- Raise `retries` to hide a flaky test. CI uses 2 retries on purpose so a trace is recorded on the first retry (local runs use 0; pass `--trace on` to get a trace); a test that passes only on retry is reported as flaky and must be fixed

## Docker and CI

- The Playwright image tag in `Dockerfile` and `.github/workflows/playwright.yml` must equal the `@playwright/test` version in `package.json`, including the Ubuntu suffix (for example `v1.64.1-noble`). Change all three together. `package.json` uses a caret range, so the installed version in `package-lock.json` is the one that counts.
- A Playwright version bump is its own change, never part of a test change. Check the release notes against the APIs this file names (rule 6 waits, locator methods).
- Use `npm ci`, not `npm install`, in Docker and CI.
- Before adding or bumping a GitHub Action, check its latest release. Do not copy versions from docs or memory. If you cannot check, ask the human for the version.

## Git

- Agents never stage, commit, or push. The human runs git.
- The pre-commit hook runs `npm run check` on the human's commits. Agents run the same command themselves before reporting a change as done.
- One concern per branch and pull request. `main` changes only through a squash-merged pull request with green CI.
- Update `README.md` (status, coverage) in the same change as the code it describes.
