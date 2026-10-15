# Use the official Playwright image. The tag must match @playwright/test in package-lock.json,
# because the image only ships the browsers for its own Playwright version.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

# Same settings as the GitHub Actions job: CI mode in playwright.config.ts, no git hooks
ENV CI=true \
    HUSKY=0 \
    BASE_URL=https://webdriveruniversity.com

# Set the working directory inside the container, owned by the same non-root user as CI
WORKDIR /app
RUN chown 1001:1001 /app
USER 1001

# Copy package files and install the exact versions from the lockfile
COPY --chown=1001:1001 package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project
COPY --chown=1001:1001 . .

# Default command (can be overridden)
CMD ["npx", "playwright", "test"]
