# Agentic testing plan

Agents act as visitors beside the scripted suite. This file is the spike plan. The scripted tests stay the required check.

## 1. What and why

The scripted suite checks known outcomes with fixed steps. Contact Us, Login Portal, Button Clicks, and Dropdown, Checkbox & Radio are covered that way today.

An agentic run gives a persona and a goal and lets a model choose the clicks. It asks whether a first-time visitor can finish a flow.

The two stay apart. A model miss must not fail `npm run check` or the Playwright Tests workflow.

## 2. Tool

| Driver                 | What it does here                                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Playwright MCP         | Browser tools over an accessibility snapshot. Already configured in `.cursor/mcp.json` as `@playwright/mcp@0.0.83`.                                                          |
| Stagehand              | Natural-language actions. Stagehand v4 does not take a Playwright page, and it has no `expect` and no trace viewer.                                                          |
| Playwright test agents | Planner, generator, and healer. They draft or repair scripted tests. `playwright-test` is already in `.cursor/mcp.json`, and the README assigns them to the authoring track. |

Use Playwright MCP. The Playwright test keeps the page, the bot-wall storage state, the trace, and the assertions. The model only picks the next action.

## 3. First spike

One persona, one flow: Contact Us. It is the finished flow with a multi-field form and one success outcome. Login Portal ends in an alert with fixed credentials. Button Clicks is three modals. Dropdown, Checkbox & Radio is a set of separate controls.

Persona: Alex, first visit. Send a short note about learning test automation, with a normal email. Do not press Reset. Stop when the page thanks you.

Start at `/Contact-Us/contactus.html` (`ContactUsPage.path`). The home page opens this challenge in a new tab, so the first spike does not start on Home.

The model sees an accessibility snapshot and returns one action: click or fill by role or accessible name, or done. The spec performs that action. It does not call `fillForm` or `fillFormAndSubmit`. Cap at 12 actions.

Pass, all of these, in the spec, after the model stops:

- `contactUsPage.successMessage` is visible (`Thank You for your Message!`).
- The URL is still `/Contact-Us/contactus.html`.
- `errorMessageRequiredFields` and `errorMessageInvalidEmail` are hidden.
- No console message of type `error`, except text already logged by the scripted happy path. Record that list on one local run of `tests/contact-us.spec.ts` before CI treats console errors as a failure.
- No response with status 500–599.

Fail if any pass check fails, the model stops before the thank-you line, or it takes more than 12 actions.

A `BotWallError` (title matching Robot Challenge, or a URL under `/.well-known/`) is an environment result. Leave it out of the pass rate.

Save a trace on every run, pass or fail (`trace: 'on'`). The main suite records a trace only on the first retry.

## 4. Repo layout

```text
agentic/personas/first-time-contact.md   persona, goal, and the 12-step cap
agentic/contact-us.agent.spec.ts         the only agentic spec
playwright.agentic.config.ts             config for that spec
```

`playwright.config.ts` sets `testDir` to `./tests`, so `npm run test` and `npm run check` never collect `agentic/`. Keep the spec out of `tests/`.

The agentic config sets its own `testDir` to `./agentic` and turns trace on. Its setup project points at `tests/bot-wall.setup.ts`, which writes `playwright/.auth/site.json`. The agentic project reuses that `storageState`. Do not skip or fake the browser check.

The spec imports `test` and `expect` from `@/fixtures/base-test` and uses the existing `contactUsPage` fixture for assertions only. No new fixture. No change to `BasePage`.

Tag it `@agentic` only. Do not tag it `@smoke` or `@regression`.

## 5. CI

Add `.github/workflows/agentic.yml`. Do not add a job to `.github/workflows/playwright.yml`.

- Same image as the suite, `mcr.microsoft.com/playwright:v1.64.1-noble`. `npm ci`, then `npx playwright test -c playwright.agentic.config.ts --repeat-each=5`. One worker.
- Triggers: `workflow_dispatch` and a weekly schedule. Not on every pull request.
- Not a required check. The test step uses `continue-on-error`. The job summary prints how many of the 5 runs passed, failed, or hit the bot wall.
- Artifacts: the HTML report and `test-results/` (traces included), kept 7 days. Do not mix them with the main `playwright-report` artifact.
- Model key: repository secret `AGENTIC_MODEL_API_KEY`. The workflow must not print it. If the secret is empty, write "skipped, no model key" and exit 0.
- This job does not run `npm run check`.

## 6. Risks

| Risk                                                                                       | Mitigation                                                                                                                                                          |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flakiness. The model mis-clicks, or the site is slow, so the same goal fails on some runs. | Assert the outcome only. Cap at 12 actions. Report the rate over 5 runs. Do not retry in Playwright: a retry hides the rate and calls the model again.              |
| Cost. Each action is a model call, and a trace on every run is a large upload.             | One persona, one flow, five runs, weekly plus manual. Step cap. Keep artifacts 7 days.                                                                              |
| Bot wall. A fresh CI browser hits the Robot Challenge and never sees the form.             | Reuse the setup project and `playwright/.auth/site.json`. Count `BotWallError` as environment, outside the pass rate.                                               |
| Non-determinism. A pass can take a path the scripted test never takes.                     | Leave `tests/contact-us.spec.ts` as the stable check. The agentic run only checks the thank-you message, the URL, console errors, and 5xx, and it stores the trace. |

## 7. Follow-up pull requests

1. Add `playwright.agentic.config.ts` and `agentic/personas/first-time-contact.md`. No model and no new dependency. Confirm `npm run check` still skips `agentic/`.
2. Add `agentic/contact-us.agent.spec.ts`: the MCP action loop, the 12-step cap, and the thank-you, URL, and error-message checks. Local only. Update the README status in that same pull request.
3. Add the console and 5xx checks, the console baseline from the scripted happy path, and `trace: 'on'`.
4. Add `.github/workflows/agentic.yml` as written above. Leave branch protection unchanged.
5. After the pass rate from that workflow is reviewed, start this persona on the home page and follow the Contact Us tab. No second persona until that is reviewed.
