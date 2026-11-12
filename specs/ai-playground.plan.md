# AI Testing Playground roadmap

Fetched `https://webdriveruniversity.com/AI-Playground/index.html` before this split was written. The heading on the page is `AI Testing Playground`. The path is `/AI-Playground/index.html`. The page lists 27 challenges. The names in this file are those headings.

Twenty-seven challenges are too many for one spec. Rule 9 is one behavior per test, and each behavior here is its own outcome (a form step, a dialog, a drag). This file is the split only: eight groups, and one pull request per group. That pull request writes the detailed plan, the spec, and the page-object section for its group. This pull request adds no tests, no page object, and no fixture.

Groups 1–7 share one page object and use the file names below. Group 8 is two later pages that the playground only links to.

## Names on the live page

Challenges 1–9 sit above the first section label. The page has no "Basics" heading. Basics A and Basics B are this roadmap's split of those nine. The later labels are on the page.

| #   | Challenge                 | Label on the page        |
| --- | ------------------------- | ------------------------ |
| 1   | Dynamic Selectors         | (above Core Challenges)  |
| 2   | Flaky Loader              | (above Core Challenges)  |
| 3   | Multi-Step Form           | (above Core Challenges)  |
| 4   | Auto-Dismiss Toast        | (above Core Challenges)  |
| 5   | Re-Enable Delay           | (above Core Challenges)  |
| 6   | Moving Target             | (above Core Challenges)  |
| 7   | Conditional Validation    | (above Core Challenges)  |
| 8   | Race Condition            | (above Core Challenges)  |
| 9   | Lazy-Rendered Element     | (above Core Challenges)  |
| 10  | iFrame Login              | Core Challenges          |
| 11  | Shadow DOM Widget         | Core Challenges          |
| 12  | Employee Directory        | Core Challenges          |
| 13  | File Upload Validator     | Core Challenges          |
| 14  | Priority Board            | Core Challenges          |
| 15  | Stale Element             | Debugging Traps          |
| 16  | Invisible Success         | Debugging Traps          |
| 17  | Timing Mismatch           | Debugging Traps          |
| 18  | Network States            | Debugging Traps          |
| 19  | JS Dialog Traps           | Debugging Traps          |
| 20  | localStorage Session      | Review & Refactor        |
| 21  | Attribute vs Visual State | Review & Refactor        |
| 22  | Mutation Observer         | Review & Refactor        |
| 23  | API Intercept             | Advanced Challenges      |
| 24  | New Tab / Popup           | Advanced Challenges      |
| 25  | Shop & Checkout Flow      | Capstone — Full E2E Flow |
| 26  | Booking Portal            | opens another page       |
| 27  | Accessibility Suite       | Accessibility Testing    |

Challenge 26 is a link, "Open Booking Portal →". Challenge 27 is a link, "Open the honey shop →", under the label Accessibility Testing. Both leave this document.

What the page is built to exercise, in one line per challenge, so a later plan starts from the live behavior:

- Dynamic Selectors: the login form's classes change on every load.
- Flaky Loader: the content appears after a delay that varies.
- Multi-Step Form: three steps, with validation on each step.
- Auto-Dismiss Toast: the notification appears and then removes itself.
- Re-Enable Delay: the button disables, then becomes enabled again.
- Moving Target: the button moves.
- Conditional Validation: an extra field may appear after the email.
- Race Condition: two operations run together, and one of them wins.
- Lazy-Rendered Element: the element is absent until it is revealed.
- iFrame Login: the form is inside an iframe.
- Shadow DOM Widget: the form is inside a shadow root.
- Employee Directory: filter, sort, and exact cell values.
- File Upload Validator: the result is the file name, size, and type.
- Priority Board: drag a task to another column and read the board.
- Stale Element: the items are rebuilt on a short timer (the page uses about 2.5 seconds).
- Invisible Success: the result is written into the DOM where it is not shown. The page points at `#ghost-result`.
- Timing Mismatch: a counter, then Capture and Verify.
- Network States: success, error, and timeout.
- JS Dialog Traps: `alert`, `confirm`, and `prompt`. An unhandled dialog blocks the test.
- localStorage Session: the value to trust is in `localStorage`. The UI can disagree with it.
- Attribute vs Visual State: the button text updates. `aria-pressed` sometimes does not.
- Mutation Observer: items are added on their own schedule.
- API Intercept: a live GET to a hosted JSON endpoint.
- New Tab / Popup: the confirmation opens in a new tab.
- Shop & Checkout Flow: products, delivery details, review, and confirm.
- Booking Portal: a booking flow on its own page, with API calls and form validation.
- Accessibility Suite: a honey shop on its own page, with accessibility problems built in.

## How the names meet AGENTS.md

Naming in `AGENTS.md` ties the page object, the file, the fixture, and the spec to the title on the site. The title here is `AI Testing Playground`, so the single-file names would be `AiTestingPlaygroundPage`, `pages/ai-testing-playground-page.ts`, fixture `aiTestingPlaygroundPage`, and `tests/ai-testing-playground.spec.ts`. Rule 8 then puts the section tag `@ai-testing-playground` on that spec, because the section tag is the spec name in kebab-case.

A group suffix (`tests/ai-playground-<group>.spec.ts`) is a second name. The reconciliation every playground pull request follows:

- The page object keeps the title. One class, `AiTestingPlaygroundPage`, in `pages/ai-testing-playground-page.ts`, fixture `aiTestingPlaygroundPage`, `path` `/AI-Playground/index.html`. Imports use `@/`.
- The spec file carries the group, because this page is split across pull requests. The file is `tests/ai-playground-<group>.spec.ts`. The `ai-playground` prefix is the name of the split. The class name stays the page title.
- Rule 8 still holds for the file that exists. The outer `describe` is tagged with the spec name, `@ai-playground-<group>`, and with `@ai-playground`, so `npx playwright test --grep @ai-playground` runs every playground spec. `@regression` is on every test. Each group's smoke subset is the one test named in that group, and that test carries `@smoke` and `@regression`.
- The coverage table still has one pending row for `tests/ai-testing-playground.spec.ts`. This pull request leaves that row. A later group pull request adds a done row for the spec it adds, and it keeps the rest of the playground pending: one pending row for the groups that have not landed, or one pending row per remaining group. Finishing Basics A leaves the page incomplete. Challenges 26 and 27 stay pending until their own pull requests.
- Challenges 26 and 27 are other pages. Their specs follow Naming from the title of the page they open, once that pull request has fetched it. They do not use the `ai-playground-` prefix, and they are not tagged `@ai-playground`. The headings on this page are `Booking Portal` and `Accessibility Suite`. The starting file names are `tests/booking-portal.spec.ts` and `tests/accessibility-suite.spec.ts`. If the destination title differs, that pull request uses the destination title.

## Page object

One class for groups 1–7. Locators and actions are grouped under a block comment per group: Basics A, Basics B, Core, Debugging Traps, Review & Refactor, Advanced, Capstone. Locator properties name the element (`flakyLoaderButton`, `toastMessage`). When two challenges share a role, the name includes the challenge so the property stays unique on the one class (`iframeLoginSubmitButton`, `shopConfirmOrderButton`).

The class returns locators and action results. It does not import or call `test` or `expect` (rules 1 and 2). The spec asserts.

The Basics A pull request adds the class and the `aiTestingPlaygroundPage` fixture in `fixtures/base-test.ts` (rule 5). Each later playground pull request adds one section to the same class and leaves the fixture file as it is. Specs take the page from the fixture.

Waits stay in the spec, and each wait names the condition (rule 6): a web-first `expect`, `waitForURL`, `waitForResponse`, or `locator.waitFor()`. The toast, the loader, the moving button, the race, and the mutation list are web-first assertions on the text or the element that shows the outcome. Dialogs use `page.waitForEvent('dialog')` before the click that opens the dialog. That is the event exception rule 6 names. The Advanced spec stays on a wait that list already includes. A call to `waitForEvent('popup')` waits for a separate rules pull request that adds `popup` beside `dialog`, because the new page is gone if nothing is listening. None of these groups use `waitForTimeout`.

## What each group pull request writes

Groups 1–7 each ship:

- `specs/ai-playground-<group>.plan.md`, with positive, negative, and edge cases ordered by ROI. The shape matches the plans already in `specs/` (case, category, priority, tags, what it checks, why this case). This roadmap does not list those cases.
- `tests/ai-playground-<group>.spec.ts`, one behavior per test.
- That group's section on `AiTestingPlaygroundPage`.
- A README coverage update in that same pull request: the new spec marked done, and a pending row still covering every playground group that has not landed.

Suggested order is the order below. Basics A is first because it adds the class and the fixture.

## 1. Basics A

Challenges 1–5: Dynamic Selectors, Flaky Loader, Multi-Step Form, Auto-Dismiss Toast, Re-Enable Delay.

Spec: `tests/ai-playground-basics-a.spec.ts`.

Detailed plan, written in that pull request: `specs/ai-playground-basics-a.plan.md`.

Tags: the outer `describe` is `{ tag: ['@ai-playground', '@ai-playground-basics-a'] }`. Every test is `@regression`. The smoke subset is the Flaky Loader reaching `Content loaded successfully!`.

Page object: the Basics A section of `AiTestingPlaygroundPage`. This pull request also adds the class and the fixture. No assertions in the page object.

Risk: the login classes change on every load, the loader delay varies, and the toast removes itself, so a generated-class locator or a fixed sleep fails on some runs.

## 2. Basics B

Challenges 6–9: Moving Target, Conditional Validation, Race Condition, Lazy-Rendered Element.

Spec: `tests/ai-playground-basics-b.spec.ts`.

Detailed plan, written in that pull request: `specs/ai-playground-basics-b.plan.md`.

Tags: the outer `describe` is `{ tag: ['@ai-playground', '@ai-playground-basics-b'] }`. Every test is `@regression`. The smoke subset is one test, the Moving Target click registering the catch, and that test is also `@regression`.

Page object: the Basics B section of the same `AiTestingPlaygroundPage`. The fixture already exists. No assertions in the page object.

Risk: the button moves while the pointer is on the way, and either race can finish first, so a click at a stale point or an assertion that A always wins flakes.

## 3. Core

Challenges 10–14: iFrame Login, Shadow DOM Widget, Employee Directory, File Upload Validator, Priority Board.

Spec: `tests/ai-playground-core.spec.ts`.

Detailed plan, written in that pull request: `specs/ai-playground-core.plan.md`.

Tags: the outer `describe` is `{ tag: ['@ai-playground', '@ai-playground-core'] }`. Every test is `@regression`. The smoke subset is one test, a successful iFrame Login inside the frame, and that test is also `@regression`.

Page object: the Core section of the same `AiTestingPlaygroundPage`. Frame and shadow locators live on that section. No assertions in the page object.

Risk: the login is inside an iframe, the widget is inside a shadow root, and the board updates only after a completed drag, so a locator on the parent page or a drop that never grabs the card misses the outcome.

## 4. Debugging Traps

Challenges 15–19: Stale Element, Invisible Success, Timing Mismatch, Network States, JS Dialog Traps.

Spec: `tests/ai-playground-debugging-traps.spec.ts`.

Detailed plan, written in that pull request: `specs/ai-playground-debugging-traps.plan.md`.

Tags: the outer `describe` is `{ tag: ['@ai-playground', '@ai-playground-debugging-traps'] }`. Every test is `@regression`. The smoke subset is one test, accepting the `alert()` from JS Dialog Traps and continuing, and that test is also `@regression`. An unhandled dialog blocks every later test.

Page object: the Debugging Traps section of the same `AiTestingPlaygroundPage`. Dialog listeners stay in the spec, registered before the click. No assertions in the page object.

Risk: the list is replaced about every 2.5 seconds, the success node is not visible, and a dialog nobody is listening for blocks the browser, so a stored locator or a late listener fails or hangs.

## 5. Review & Refactor

Challenges 20–22: localStorage Session, Attribute vs Visual State, Mutation Observer.

Spec: `tests/ai-playground-review-refactor.spec.ts`.

Detailed plan, written in that pull request: `specs/ai-playground-review-refactor.plan.md`.

Tags: the outer `describe` is `{ tag: ['@ai-playground', '@ai-playground-review-refactor'] }`. Every test is `@regression`. The smoke subset is one test, the localStorage Session value after login, and that test is also `@regression`.

Page object: the Review & Refactor section of the same `AiTestingPlaygroundPage`. Reading `localStorage` is an action that returns the value. The spec asserts it. No assertions in the page object.

Risk: the visible label can be right while `aria-pressed` or `localStorage` is wrong, and items appear on their own schedule, so a text assertion or a sleep passes a bug or flakes.

## 6. Advanced

Challenges 23–24: API Intercept, New Tab / Popup.

Spec: `tests/ai-playground-advanced.spec.ts`.

Detailed plan, written in that pull request: `specs/ai-playground-advanced.plan.md`.

Tags: the outer `describe` is `{ tag: ['@ai-playground', '@ai-playground-advanced'] }`. Every test is `@regression`. The smoke subset is one test, the API Intercept path that returns the mocked payload, and that test is also `@regression`.

Page object: the Advanced section of the same `AiTestingPlaygroundPage`. The route is installed in the spec before the click. The page object exposes the control. The spec waits with a condition rule 6 already allows, then reads the new tab. No assertions in the page object.

Risk: the GET is in flight as soon as the control is clicked, and the confirmation page exists only as the tab that click opens, so a route installed after the click, or a read of the tab before it exists, misses the page.

## 7. Capstone

Challenge 25: Shop & Checkout Flow.

Spec: `tests/ai-playground-capstone.spec.ts`.

Detailed plan, written in that pull request: `specs/ai-playground-capstone.plan.md`.

Tags: the outer `describe` is `{ tag: ['@ai-playground', '@ai-playground-capstone'] }`. Every test is `@regression`. The smoke subset is one test, a shop order that reaches the confirmation and shows an order id, and that test is also `@regression`. Empty cart, invalid postcode, and the other failures stay `@regression`.

Page object: the Capstone section of the same `AiTestingPlaygroundPage`. One flow can be several methods (add to cart, delivery, review, confirm). Each test is still one outcome. No assertions in the page object.

Risk: cart, delivery, and confirm share one page state, so a product total or a postcode check that depends on a clock fails on a later step because an earlier step did not finish.

## 8. Later, separate pages

Challenges 26 and 27. Each is its own pull request after the playground groups, with its own page object, its own detailed plan, and its own spec. They are not sections of `AiTestingPlaygroundPage`.

### Booking Portal (26)

The playground challenge is a link to another page. That pull request fetches the destination and names the class from the destination title. Starting names, if the title is Booking Portal: `BookingPortalPage`, `pages/booking-portal-page.ts`, fixture `bookingPortalPage`, spec `tests/booking-portal.spec.ts`, plan `specs/booking-portal.plan.md`.

Tags: the outer `describe` is `{ tag: ['@booking-portal'] }`, the spec name, per rule 8. Every test is `@regression`. The smoke subset is one successful booking, and that test is also `@regression`. The group plan names the success path after it has seen the page. This spec is not tagged `@ai-playground`.

Page object: a new page object for that page only. No assertions in the page object. A new fixture in `fixtures/base-test.ts` (rule 5).

Risk: the flow depends on API calls and field validation, so a wait on the wrong response, or a sleep in place of the validation message, flakes.

### Accessibility Suite (27)

The playground challenge is a link to a honey shop, under the label Accessibility Testing. That pull request fetches the shop and names the class from the shop's title. Starting names, if the title is Accessibility Suite: `AccessibilitySuitePage`, `pages/accessibility-suite-page.ts`, fixture `accessibilitySuitePage`, spec `tests/accessibility-suite.spec.ts`, plan `specs/accessibility-suite.plan.md`.

Tags: the outer `describe` is `{ tag: ['@accessibility-suite'] }`. Every test is `@regression`. The smoke subset is one checkout that fills the basket, applies a code, and completes checkout, and that test is also `@regression`. This spec is not tagged `@ai-playground`.

Page object: a new page object for the shop only. No assertions in the page object. A new fixture in `fixtures/base-test.ts` (rule 5).

Risk: unlabeled controls, low contrast, mouse-only actions, and silent updates do not fail a click that never hit the control, so a test that only waits for visible text can pass while the basket never changed.
