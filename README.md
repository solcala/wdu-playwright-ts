# WebdriverUniversity — Playwright + TypeScript

[![Playwright Tests](https://github.com/solcala/wdu-playwright-ts/actions/workflows/playwright.yml/badge.svg)](https://github.com/solcala/wdu-playwright-ts/actions/workflows/playwright.yml)

**[Latest test report](https://solcala.github.io/wdu-playwright-ts/)**: the Playwright HTML report from the most recent run on `main`, published on GitHub Pages.

Portfolio project: an end-to-end test suite for [WebdriverUniversity](https://webdriveruniversity.com/index.html), built with **Playwright Test** and **TypeScript**, and grown phase by phase into an **AI-native QA** setup. AI agents explore pages, draft test plans, triage failures, and heal broken locators. Every agent change goes through human review and CI before it is merged.

## What this project demonstrates

### Test engineering (built)

- Page Object Model with an abstract `BasePage`, and thin specs that read like test cases
- Page objects injected through Playwright fixtures (`test.extend`), not built by hand in each test
- Locators in order: role with a name, label, placeholder, text, test id when the app has them, a stable unique id, CSS, then XPath only as a last resort
- No fixed sleeps: only Playwright's auto-waiting and web-first assertions
- Negative paths, edge cases, keyboard flow, and accessible-name checks, not only the happy path
- Tags: every test gets its section tag (the spec name in kebab-case, such as `@button-clicks`) and `@regression`; `@smoke` is a small subset, and those tests carry both

### Quality gates (built)

- ESLint with `eslint-plugin-playwright`, then Prettier (`prettier --check`), strict TypeScript, and a Husky pre-commit hook that runs lint, typecheck, and tests
- GitHub Actions running inside the official Playwright Docker image, pinned to the package version
- Same image for local Docker runs, so a CI failure reproduces locally
- HTML report, traces, screenshots, and video kept as CI artifacts, and the latest `main` report published on GitHub Pages
- Protected `main`: changes only through squash-merged pull requests with passing CI and resolved review conversations

### AI-native QA (in progress)

- Repo context (`AGENTS.md`, Cursor rules) so any coding agent follows the suite's conventions (built)
- Playwright Test Agents: the planner and generator draft tests, and a human reviews them before merge
- Structured failure artifacts that an agent can read
- Triage agent that classifies failures and cites evidence from the artifacts
- Guarded healing: the healer may fix locators but never weaken an assertion; every heal is logged
- Evals that score the triage and healing agents against labeled cases

## Project status

| Area                                                         | Status                 |
| ------------------------------------------------------------ | ---------------------- |
| Playwright + TypeScript skeleton                             | ✅ Done                |
| Home page smoke test                                         | ✅ Done                |
| Contact Us challenge                                         | ✅ Done                |
| Login Portal challenge                                       | ✅ Done                |
| Button Clicks challenge                                      | ✅ Done                |
| Dropdown, Checkbox & Radio challenge                         | ✅ Done                |
| Actions challenge                                            | ✅ Done                |
| Ajax Loader challenge                                        | ✅ Done                |
| To Do List challenge                                         | ✅ Done                |
| CI on GitHub Actions (Playwright Docker image)               | ✅ Done                |
| Published test report (GitHub Pages)                         | ✅ Done                |
| Agent context (`AGENTS.md`, Cursor rules, Playwright agents) | ✅ Done                |
| Agent hooks (Markdown format, typecheck on stop)             | ✅ Done                |
| Remaining challenges                                         | Pending (see coverage) |
| AI track: failure artifacts, triage, guarded healing, evals  | Pending                |

## Coverage

78 challenge tests in 8 spec files, plus one setup test that passes the site's browser check and stops the run if it cannot. Chromium only.

| Challenge                  | Spec                                    | Tests | Status  |
| -------------------------- | --------------------------------------- | ----: | ------- |
| Home page                  | `tests/home.spec.ts`                    |     1 | ✅ Done |
| Contact Us                 | `tests/contact-us.spec.ts`              |    15 | ✅ Done |
| Login Portal               | `tests/login-portal.spec.ts`            |     6 | ✅ Done |
| Button Clicks              | `tests/button-clicks.spec.ts`           |     6 | ✅ Done |
| Dropdown, Checkbox & Radio | `tests/dropdown-checkbox-radio.spec.ts` |    26 | ✅ Done |
| Popup & Alerts             | `tests/popup-alerts.spec.ts`            |     — | Pending |
| Actions                    | `tests/actions.spec.ts`                 |    12 | ✅ Done |
| IFrame                     | `tests/iframe.spec.ts`                  |     — | Pending |
| Ajax Loader                | `tests/ajax-loader.spec.ts`             |     4 | ✅ Done |
| Autocomplete               | `tests/autocomplete.spec.ts`            |     — | Pending |
| Datepicker                 | `tests/datepicker.spec.ts`              |     — | Pending |
| File Upload                | `tests/file-upload.spec.ts`             |     — | Pending |
| To Do List                 | `tests/todo-list.spec.ts`               |     8 | ✅ Done |
| Accordion Items            | `tests/accordion-items.spec.ts`         |     — | Pending |
| Hidden Elements            | `tests/hidden-elements.spec.ts`         |     — | Pending |
| Data Tables                | `tests/data-tables.spec.ts`             |     — | Pending |
| Page Object Model          | `tests/page-object-model.spec.ts`       |     — | Pending |
| Scrolling                  | `tests/scrolling.spec.ts`               |     — | Pending |
| AI Testing Playground      | `tests/ai-testing-playground.spec.ts`   |     — | Pending |

Contact Us covers: page elements, valid submit, empty and invalid-email errors, reset, navigation buttons on the success and error pages, valid and invalid email formats, special characters and whitespace-only input, tab order and Enter to submit, accessible names, and the resizable comments box.

### Login Portal

Run all six tests, or only the smoke test:

```bash
npx playwright test tests/login-portal.spec.ts
npx playwright test tests/login-portal.spec.ts --grep @smoke
```

`tests/login-portal.spec.ts` uses the `loginPortalPage` fixture. Scenarios:

| Group                  | What it checks                                                           | Tag                    |
| ---------------------- | ------------------------------------------------------------------------ | ---------------------- |
| Form validation        | Username and password placeholders are `Username` and `Password`         | `@regression`          |
| Submit                 | Empty submit shows the alert `validation failed`                         | `@regression`          |
| Submit / Happy path    | `webdriver` / `webdriver123` shows the alert `validation succeeded`      | `@smoke` `@regression` |
| Submit / Negative path | `webdriver` / `wrong-password` shows the alert `validation failed`       | `@regression`          |
| Submit / Edge cases    | `Webdriver` fails because the check is case-sensitive                    | `@regression`          |
| Submit / Edge cases    | `webdriver` with a trailing space fails because the value is not trimmed | `@regression`          |

The five submit tests each accept the alert and check that text against a message stored in the test. They share an `afterEach` that checks the page stays on `/Login-Portal/index.html?`. The login button submits the form, and the page's jQuery never loads, so the script that would cancel the submit never runs. The jQuery fade and the Home link are not covered.

### Button Clicks

Run all six tests, or only the smoke tests:

```bash
npx playwright test tests/button-clicks.spec.ts
npx playwright test tests/button-clicks.spec.ts --grep @smoke
```

`tests/button-clicks.spec.ts` uses the `buttonClicksPage` fixture. Scenarios:

| What it checks                                                                                            | Tag                    |
| --------------------------------------------------------------------------------------------------------- | ---------------------- |
| `CLICK ME!` opens the Congratulations! modal, including the `click()` message, and Close hides it         | `@smoke` `@regression` |
| `CLICK ME!!` opens the It’s that Easy!! modal, including the JavaScript click message, and Close hides it | `@smoke` `@regression` |
| `CLICK ME!!!` opens the Action Move & Click modal, including the interactions message, and Close hides it | `@smoke` `@regression` |
| Before a click every modal is hidden, and a click opens only that control's modal                         | `@regression`          |
| The × button hides the open modal, and the same control opens it again                                    | `@regression`          |
| A click on the overlay, outside the dialog, hides the modal                                               | `@regression`          |

The three controls are spans. A normal click opens each modal. The column text asks for an XPath click, a JavaScript click, and an action move and click; the controls do not move, and a normal click is what opens them. Escape does not close a modal, and the open modal covers its control, so those two are not tests. `js/script.js` is not valid JavaScript, and Bootstrap is loaded twice. Neither of those is asserted.

### Dropdown, Checkbox & Radio

Run all 26 tests, or only the smoke tests:

```bash
npx playwright test tests/dropdown-checkbox-radio.spec.ts
npx playwright test tests/dropdown-checkbox-radio.spec.ts --grep @smoke
```

`tests/dropdown-checkbox-radio.spec.ts` uses the `dropdownCheckboxRadioPage` fixture. The live path is `/Dropdown-Checkboxes-RadioButtons/index.html`. Scenarios:

| What it checks                                                                                          | Tag                    |
| ------------------------------------------------------------------------------------------------------- | ---------------------- |
| `C#` becomes the selected language, and its value is `c#`                                               | `@smoke` `@regression` |
| `TestNG` becomes the selected tool, and its value is `testng`                                           | `@smoke` `@regression` |
| `JQuery` becomes the selected technology, and its value is `jquery`                                     | `@smoke` `@regression` |
| The language menu starts on `JAVA`                                                                      | `@regression`          |
| The tool menu starts on `Eclipse`                                                                       | `@regression`          |
| The technology menu starts on `HTML`                                                                    | `@regression`          |
| Selecting `Python` leaves the tool, technology, and fruit menus unchanged                               | `@regression`          |
| Selecting `Apple` leaves the language, tool, and technology menus unchanged                             | `@regression`          |
| `SQL` replaces `Python`, and only `SQL` stays selected                                                  | `@regression`          |
| `JUnit` replaces `Maven`, and only `JUnit` stays selected                                               | `@regression`          |
| `CSS` replaces `JavaScript`, and only `CSS` stays selected                                              | `@regression`          |
| Option 1 and Option 4 can be checked together, Option 2 stays clear, and Option 3 stays checked         | `@smoke` `@regression` |
| Option 3 starts checked and the other boxes do not                                                      | `@regression`          |
| Option 3 can be unchecked, and the other boxes stay clear                                               | `@regression`          |
| Unchecking Option 1 leaves Option 2 and Option 3 checked                                                | `@regression`          |
| Blue can be selected, and the other colors stay clear                                                   | `@smoke` `@regression` |
| No color radio starts selected                                                                          | `@regression`          |
| Selecting Orange after Yellow leaves only Orange selected                                               | `@regression`          |
| Clicking the selected Purple radio again leaves it selected                                             | `@regression`          |
| Lettuce can be selected, which clears Pumpkin                                                           | `@smoke` `@regression` |
| Pear can be selected                                                                                    | `@smoke` `@regression` |
| Pumpkin starts selected, and Lettuce does not                                                           | `@regression`          |
| Cabbage is disabled and not selected                                                                    | `@regression`          |
| The fruit menu starts on Grape                                                                          | `@regression`          |
| Orange is disabled                                                                                      | `@regression`          |
| Selecting a color does not change the vegetable radios, and selecting Lettuce does not clear that color | `@regression`          |

The controls are native. Option values are lower case (`C#` is `c#`, `TestNG` is `testng`, `JQuery` is `jquery`). The color and vegetable captions are not labels, so a click on the word does not select the radio; the tests use the inputs. `selectOption` on the disabled Orange option waits until the action timeout, so the test asserts that the option is disabled instead. The `autofocus` attribute on that option does nothing. The navbar and the old `Dropdown-Checkboxe-RadioButtons` URL, which is a 404, are not covered.

### Actions

Run all 12 tests, or only the smoke tests:

```bash
npx playwright test tests/actions.spec.ts
npx playwright test tests/actions.spec.ts --grep @smoke
```

`tests/actions.spec.ts` uses the `actionsPage` fixture. The live path is `/Actions/index.html`. Every test is also tagged `@actions`. The case list is `specs/actions.plan.md`. Scenarios:

| What it checks                                                                                                         | Tag                    |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Dragging onto the target shows `Dropped!`, highlights the target, and turns both labels green                          | `@smoke` `@regression` |
| A drag onto the page heading moves the box and leaves `DROP HERE!`                                                     | `@regression`          |
| After a drop, dragging the box onto the heading leaves `Dropped!`                                                      | `@regression`          |
| A double click adds the `double` class and turns the heading green                                                     | `@smoke` `@regression` |
| A single click leaves the double-click box off                                                                         | `@regression`          |
| A second double click removes `double` and turns the heading back                                                      | `@regression`          |
| Hovering the first menu reveals `Link 1`, and clicking it alerts `Well done you clicked on the link!`                  | `@smoke` `@regression` |
| Each hover shows only that menu's links, including `Link 2` on the third menu                                          | `@regression`          |
| Moving the pointer to the heading hides the open menu                                                                  | `@regression`          |
| `Link 2` alerts `Well done you clicked on the link!`                                                                   | `@regression`          |
| Pressing the box shows `Well done! keep holding that click now.....`, and releasing over it shows `Dont release me!!!` | `@smoke` `@regression` |
| Releasing the pointer over the heading keeps the hold message                                                          | `@regression`          |

The drop does not reset. The double-click listener is `dblclick`, and it toggles. The hover links share one alert, so the other `Link 1` clicks are not separate tests. `mouseup` on the hold box is the only release. The page has no fields and no keyboard handlers for these widgets. The release text is spelled `Dont`.

### Ajax Loader

Run all four tests, or only the smoke test:

```bash
npx playwright test tests/ajax-loader.spec.ts
npx playwright test tests/ajax-loader.spec.ts --grep @smoke
```

`tests/ajax-loader.spec.ts` uses the `ajaxLoaderPage` fixture. The describe block is tagged `@ajax-loader`. The live path is `/Ajax-Loader/index.html`. Scenarios:

| What it checks                                                                      | Tag                    |
| ----------------------------------------------------------------------------------- | ---------------------- |
| The loader finishes, `CLICK ME!` opens the waiting-result modal, and Close hides it | `@smoke` `@regression` |
| While the loader is showing, `CLICK ME!` and the modal stay hidden                  | `@regression`          |
| The × button hides the modal, and `CLICK ME!` opens it again                        | `@regression`          |
| A click on the overlay, outside the dialog, hides the modal                         | `@regression`          |

The delay is a timer of about five seconds in the page, not an XHR. The tests wait until `CLICK ME!` is visible. The span is not keyboard accessible, and Escape does not close the modal, so those are not tests. The `clicked` class changes the control's color; the asserted result is the modal.

### To Do List

Run all eight tests, or only the smoke tests:

```bash
npx playwright test tests/todo-list.spec.ts
npx playwright test tests/todo-list.spec.ts --grep @smoke
```

`tests/todo-list.spec.ts` uses the `todoListPage` fixture. The describe block is tagged `@todo-list`. The live path is `/To-Do-List/index.html`. The case list is `specs/todo-list.plan.md`. Scenarios:

| What it checks                                                                                               | Tag                    |
| ------------------------------------------------------------------------------------------------------------ | ---------------------- |
| The list starts as `Go to potion class`, `Buy new robes`, and `Practice magic`, none struck through          | `@regression`          |
| Enter on `Brew a potion` adds that row, clears the field, and leaves the count at 4                          | `@smoke` `@regression` |
| Clicking `Buy new robes` strikes it through, leaves the count at 3, and leaves the other rows open           | `@smoke` `@regression` |
| Hovering `Practice magic` opens its delete control, and the click removes that row and leaves the count at 2 | `@smoke` `@regression` |
| Enter on an empty field adds a blank row and leaves the count at 4                                           | `@regression`          |
| A second click on `Buy new robes` clears the strike-through and leaves the count at 3                        | `@regression`          |
| The plus icon hides the add field, then shows it again, and the count stays 3                                | `@regression`          |
| Enter on `Practice "magic" & potions` shows that text and leaves the count at 4                              | `@regression`          |

Enter is the only way to add a row. The plus icon toggles the field and does not add one. A click toggles the `completed` class, which strikes the text through. The delete control is a span at width 0 until the row is hovered; the click fades that row out and removes it. Empty Enter is not rejected. The quotes-and-ampersand row is stored as text.

## Project layout

```text
pages/                  Page objects (one class per file, kebab-case file names)
  base-page.ts          Abstract BasePage: page, path, navigateTo()
  home-page.ts
  contact-us-page.ts
  login-portal-page.ts
  button-clicks-page.ts
  dropdown-checkbox-radio-page.ts
  actions-page.ts
  ajax-loader-page.ts
  todo-list-page.ts
fixtures/base-test.ts   test.extend page fixtures; specs import test/expect from here
support/bot-wall.ts     Waits for the site's browser check to finish. No test runner calls
tests/                  *.spec.ts files, plus bot-wall.setup.ts which passes the check once and saves the browser state
playwright.config.ts    baseURL, reporters, trace/screenshot/video on failure
.github/workflows/      GitHub Actions workflow
Dockerfile              Runs the suite in the same image as CI
AGENTS.md               Rules every coding agent follows in this repo
.cursor/rules/          Cursor rule for test, page, fixture, and support files
.cursor/hooks.json      Agent hooks: format Markdown, TypeScript, and ES modules after an edit; typecheck when the agent stops
.cursor/hooks/          format-file.js and check-ts.js
.cursor/mcp.json        Project MCP servers: Playwright browser and Playwright Test
```

Imports use the `@/` alias for the repo root, for example `import { ContactUsPage } from '@/pages/contact-us-page'`.

## Run locally

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

`npm install` also turns on the Husky pre-commit hook.

`.env` sets `BASE_URL` (default `https://webdriveruniversity.com`). Without it, `playwright.config.ts` falls back to the same URL.

### Run the tests

```bash
npx playwright test                              # all tests, headless
npx playwright test tests/contact-us.spec.ts     # one spec
npx playwright test tests/login-portal.spec.ts   # Login Portal (see Coverage)
npx playwright test tests/button-clicks.spec.ts  # Button Clicks (see Coverage)
npx playwright test tests/dropdown-checkbox-radio.spec.ts  # Dropdown, Checkbox & Radio (see Coverage)
npx playwright test tests/actions.spec.ts                # Actions (see Coverage)
npx playwright test tests/ajax-loader.spec.ts              # Ajax Loader (see Coverage)
npx playwright test tests/todo-list.spec.ts                # To Do List (see Coverage)
npx playwright test --grep @smoke                # smoke subset (also `@regression`)
npx playwright test --grep @regression           # regression subset, which includes smoke
npx playwright test --headed                     # watch the browser
npx playwright test --debug                      # step through with the inspector
npx playwright test --ui                         # UI mode
npx playwright show-report                       # open the last HTML report
```

### Checks

| Script              | What it runs                  |
| ------------------- | ----------------------------- |
| `npm run lint`      | ESLint, then prettier --check |
| `npm run typecheck` | `tsc --noEmit`                |
| `npm run test`      | `playwright test`             |
| `npm run check`     | All three, in that order      |

The pre-commit hook runs `npm run check` and blocks the commit if it fails.

Locally, failures keep a screenshot and video. Traces are recorded only on the first retry, and local runs do not retry, so run with `--trace on` when you need a trace.

## Run in Docker

Uses `mcr.microsoft.com/playwright:v1.64.1-noble`, the same image as CI. Browsers are already in the image.

```bash
docker build -t wdu-playwright .
docker run --rm --init --ipc=host -v "$PWD/playwright-report:/app/playwright-report" wdu-playwright
npx playwright show-report playwright-report
```

`--ipc=host` stops Chromium from running out of shared memory and crashing. `--init` cleans up leftover browser processes.

The image tag must match `@playwright/test` in `package-lock.json`. When you upgrade Playwright, update the tag in `Dockerfile` and `.github/workflows/playwright.yml` in the same change.

The container runs as user `1001`, the same as CI. If the mounted `playwright-report` folder is not writable, create it first and give that user write access.

## CI

Workflow: `.github/workflows/playwright.yml`. Runs on every push and pull request to `main`.

The job runs inside `mcr.microsoft.com/playwright:v1.64.1-noble`. The image tag is pinned to the `@playwright/test` version; if they differ, Playwright cannot find the browsers. Update both together.

Steps:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npx playwright test`, with the `html`, `github`, and `list` reporters
5. Upload `playwright-report/` as the `playwright-report` artifact, kept 30 days, even when tests fail
6. Write the image, base URL, and report location to the job summary
7. On pushes to `main` only: a second job, `deploy-report`, publishes the HTML report to [GitHub Pages](https://solcala.github.io/wdu-playwright-ts/). It publishes even when tests fail, so the public report always shows the latest `main` result. On pull requests this job is skipped

On CI: one worker, two retries, and `test.only` fails the run.

The site runs an automatic browser check (SiteGround's "Robot Challenge Screen") on browsers without its cookie. A real browser passes it on its own in a few seconds. The setup test (`tests/bot-wall.setup.ts`) opens the site once, waits until the real page has loaded, and saves the browser state to `playwright/.auth/site.json` (gitignored). Every other test starts with that state, so the site does not challenge it again. Nothing about the check is skipped or faked; the suite behaves like one returning visitor instead of a new visitor per test.

If the check does not pass after one reload, the setup test fails and the rest of the suite does not run. Any other failure still runs the remaining tests, so the report shows every product failure. The bot-wall message says the site blocked CI. It is not a product failure.

Later, for a large suite: if that same bot-wall failure starts repeating after the run has begun (for example five in a row), abort the rest and review. One wall failure stays a single result. Waiting for thousands of tests to fail the same way does not add information. That abort must key off the bot-wall error only. `maxFailures` would also stop the run on a normal assertion failure and hide the rest of the report.

To read a CI report:

- Latest `main` run: open the [published report](https://solcala.github.io/wdu-playwright-ts/).
- Any run, including pull requests: open the run, download the `playwright-report` artifact, unzip it, then run `npx playwright show-report playwright-report`.

The only thing deployed is the test report. This repo is a test suite, so there is no application to release.

## Working with AI agents

- Rules live in `AGENTS.md`. Any agent that opens the repo reads it: Cursor chats, cloud agents, and review bots. `.cursor/rules/playwright-tests.mdc` repeats the test rules with examples for Cursor; if the two differ, `AGENTS.md` wins.
- Cursor hooks in `.cursor/hooks.json` run even when an agent ignores those rules. After an edit, `node .cursor/hooks/format-file.js` formats `.md`, `.ts`, and `.mjs` files with Prettier, which infers the parser from the path, and skips paths in `.prettierignore` (`node_modules/`, `playwright-report/`, `test-results/`, `blob-report/`, `playwright/.auth/`, `package-lock.json`). When the agent stops, `npm run typecheck` runs on the whole project and, if it fails, Cursor sends the errors back so the agent can fix them (up to 3 times). Husky is the commit gate and still runs `npm run check`. In Cursor, see them under Customize, the Hooks tab, or the Hooks output channel.
- `.cursor/mcp.json` adds two MCP servers: `playwright` (`@playwright/mcp`, pinned) to explore pages, and `playwright-test` (`playwright run-test-mcp-server`) for Playwright's planner, generator, and healer agents. The second ships with `@playwright/test`, so it always matches the suite's version.
- How an agent works depends on whether a human is in the conversation. Interactive (a chat in the IDE): edit locally, and do not stage, commit, push, or open a pull request unless the human asks. Autonomous (a cloud agent, background agent, or automation with no human in the conversation): create a branch from `main`, commit, push, and open the pull request, as a draft when a question is still open. Agents never merge. Every change goes through a pull request with passing CI.
- Playwright's planner, generator, and healer agent definitions are not committed yet. They arrive in the AI phases with this repo's rules added.

## How this project is built

- One branch and one pull request per phase. `main` is protected and only changes through a pull request with passing CI.
- Each phase starts with exploring the page and writing a test plan, then the code, then review by a human and by AI.
- AI agents propose; a human approves. Agent-generated code meets the same rules and CI gate as hand-written code.
- Every phase updates this README: project status, coverage table, and any new run instructions.
