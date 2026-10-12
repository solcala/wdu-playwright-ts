# WebdriverUniversity — Playwright + TypeScript

Practice suite for [WebdriverUniversity](https://webdriveruniversity.com/index.html) using **Playwright Test** and **TypeScript**.

## Prerequisites

- Node.js 20+
- npm

## Install

```bash
npm init -y
npm install -D @playwright/test typescript
npx playwright install chromium
```

## Run

```bash
npx playwright test
npx playwright test --headed
npx playwright test --debug
npx playwright test --ui
```

Tests target `https://webdriveruniversity.com` via `baseURL` in `playwright.config.ts`.
