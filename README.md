# WebdriverUniversity — Playwright + TypeScript

[![Playwright Tests](https://github.com/solcala/wdu-playwright-ts/actions/workflows/playwright.yml/badge.svg)](https://github.com/solcala/wdu-playwright-ts/actions/workflows/playwright.yml)

Portfolio project: an end-to-end test suite for [WebdriverUniversity](https://webdriveruniversity.com/index.html), built with **Playwright Test** and **TypeScript**, and grown phase by phase into an **AI-native QA** setup. AI agents explore pages, draft test plans, triage failures, and heal broken locators. Every agent change goes through human review and CI before it is merged.

## What this project demonstrates

### Test engineering (built)

- Page Object Model with an abstract `BasePage`, and thin specs that read like test cases
- Page objects injected through Playwright fixtures (`test.extend`), not built by hand in each test
- Locators by role, label, and placeholder first; CSS only when nothing else is unambiguous
- No fixed sleeps: only Playwright's auto-waiting and web-first assertions
- Negative paths, edge cases, keyboard flow, and accessible-name checks, not only the happy path
- Tags (`@smoke`, `@regression`) for running a subset

### Quality gates (built)

- ESLint with `eslint-plugin-playwright`, strict TypeScript, and a Husky pre-commit hook that runs lint, typecheck, and tests
- GitHub Actions running inside the official Playwright Docker image, pinned to the package version
- Same image for local Docker runs, so a CI failure reproduces locally
- HTML report, traces, screenshots, and video kept as CI artifacts

### AI-native QA (in progress)

- Repo context (`AGENTS.md`, Cursor rules) so any coding agent follows the suite's conventions
- Playwright Test Agents: the planner and generator draft tests, and a human reviews them before merge
- Structured failure artifacts that an agent can read
- Triage agent that classifies failures and cites evidence from the artifacts
- Guarded healing: the healer may fix locators but never weaken an assertion; every heal is logged
- Evals that score the triage and healing agents against labeled cases

## Project status

| Area | Status |
| --- | --- |
| Playwright + TypeScript skeleton | Done |
| Home page smoke test | Done |
| Contact Us challenge | Done |
| CI on GitHub Actions (Playwright Docker image) | In review |
| Agent context (`AGENTS.md`, Cursor rules, Playwright agents) | Pending |
| Remaining challenges | Pending (see coverage) |
| AI track: failure artifacts, triage, guarded healing, evals | Pending |

## Coverage

16 tests in 2 spec files, Chromium only.

| Challenge | Spec | Tests | Status |
| --- | --- | ---: | --- |
| Home page | `tests/home.spec.ts` | 1 | Done |
| Contact Us | `tests/contact-us.spec.ts` | 15 | Done |
| Login Portal | `tests/login-portal.spec.ts` | — | Pending |
| Button Clicks | `tests/button-clicks.spec.ts` | — | Pending |
| Dropdown, Checkbox & Radio | `tests/dropdown-checkbox-radio.spec.ts` | — | Pending |
| Popup & Alerts | `tests/popup-alerts.spec.ts` | — | Pending |
| Actions | `tests/actions.spec.ts` | — | Pending |
| IFrame | `tests/iframe.spec.ts` | — | Pending |
| Ajax Loader | `tests/ajax-loader.spec.ts` | — | Pending |
| Autocomplete | `tests/autocomplete.spec.ts` | — | Pending |
| Datepicker | `tests/datepicker.spec.ts` | — | Pending |
| File Upload | `tests/file-upload.spec.ts` | — | Pending |
| To Do List | `tests/todo-list.spec.ts` | — | Pending |
| Accordion / Hidden Elements | `tests/accordion-hidden.spec.ts` | — | Pending |
| Data Tables | `tests/data-tables.spec.ts` | — | Pending |
| Page Object Model | `tests/page-object-model.spec.ts` | — | Pending |
| Scrolling | `tests/scrolling.spec.ts` | — | Pending |

Contact Us covers: page elements, valid submit, empty and invalid-email errors, reset, navigation buttons on the success and error pages, valid and invalid email formats, special characters and whitespace-only input, tab order and Enter to submit, accessible names, and the resizable comments box.

## Project layout

```text
pages/                  Page objects (one class per file, kebab-case file names)
  base-page.ts          Abstract BasePage: page, path, navigateTo()
  home-page.ts
  contact-us-page.ts
fixtures/base-test.ts   test.extend page fixtures; specs import test/expect from here
tests/                  *.spec.ts files
playwright.config.ts    baseURL, reporters, trace/screenshot/video on failure
.github/workflows/      GitHub Actions workflow
Dockerfile              Runs the suite in the same image as CI
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
npx playwright test --grep @smoke                # smoke subset
npx playwright test --headed                     # watch the browser
npx playwright test --debug                      # step through with the inspector
npx playwright test --ui                         # UI mode
npx playwright show-report                       # open the last HTML report
```

### Checks

| Script | What it runs |
| --- | --- |
| `npm run lint` | ESLint, including `eslint-plugin-playwright` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | `playwright test` |
| `npm run check` | All three, in that order |

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

On CI: one worker, two retries, and `test.only` fails the run.

To read a CI report: open the run, download the `playwright-report` artifact, unzip it, then run `npx playwright show-report playwright-report`.

There is no deployment step. This repo is a test suite, so CI is the whole pipeline.

## How this project is built

- One branch and one pull request per phase. `main` is protected and only changes through a pull request with passing CI.
- Each phase starts with exploring the page and writing a test plan, then the code, then review by a human and by AI.
- AI agents propose; a human approves. Agent-generated code meets the same rules and CI gate as hand-written code.
- Every phase updates this README: project status, coverage table, and any new run instructions.
