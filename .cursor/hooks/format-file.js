'use strict';

/**
 * afterFileEdit hook. Formats an edited Markdown, TypeScript, or ES module file with Prettier.
 * Prettier infers the parser from the path. Files excluded by .prettierignore are skipped.
 * Failures are logged and never block the agent (exit 0).
 */

const fs = require('node:fs');
const path = require('node:path');

const FORMATTED_EXTENSIONS = new Set(['.md', '.ts', '.mjs']);

let prettier;
try {
  prettier = require('prettier');
} catch (error) {
  console.error(`[format-file] prettier is not installed: ${error instanceof Error ? error.message : error}`);
  process.exit(0);
}

/**
 * Reads the hook payload Cursor writes to stdin.
 * @returns The raw stdin string
 */
function readStdin() {
  return fs.readFileSync(0, 'utf8');
}

/**
 * Reports a hook failure and lets the agent continue.
 * @param {string} message - What went wrong, without a stack trace
 */
function failOpen(message) {
  console.error(`[format-file] ${message}`);
  process.exit(0);
}

/**
 * Formats one file in place when .prettierignore does not exclude it.
 * Uses the project Prettier config so the result matches `prettier --check`.
 * @param {string} filePath - Absolute or project-relative path from the hook payload
 * @returns {Promise<void>}
 */
async function formatSourceFile(filePath) {
  const root = process.env.CURSOR_PROJECT_DIR || process.cwd();
  const resolved = path.resolve(root, filePath);
  const info = await prettier.getFileInfo(resolved, {
    ignorePath: path.resolve(root, '.prettierignore'),
  });
  if (info.ignored) {
    return;
  }

  const source = fs.readFileSync(resolved, 'utf8');
  const config = (await prettier.resolveConfig(resolved)) ?? {};
  const formatted = await prettier.format(source, {
    ...config,
    filepath: resolved,
  });
  if (formatted !== source) {
    fs.writeFileSync(resolved, formatted);
  }
}

/**
 * Handles one afterFileEdit payload.
 * @returns {Promise<void>}
 */
async function main() {
  let raw;
  try {
    raw = readStdin();
  } catch (error) {
    failOpen(`could not read stdin: ${error instanceof Error ? error.message : error}`);
    return;
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch (error) {
    failOpen(`invalid JSON on stdin: ${error instanceof Error ? error.message : error}`);
    return;
  }

  const filePath = input && typeof input.file_path === 'string' ? input.file_path : '';
  if (!filePath) {
    failOpen('missing file_path');
    return;
  }

  if (!FORMATTED_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
    process.exit(0);
  }

  try {
    await formatSourceFile(filePath);
  } catch (error) {
    failOpen(error instanceof Error ? error.message : String(error));
  }
}

main().catch((error) => {
  failOpen(error instanceof Error ? error.message : String(error));
});
