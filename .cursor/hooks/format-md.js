'use strict';

/**
 * afterFileEdit hook. Formats the edited file with Prettier when it is Markdown.
 * Any other file is skipped. Failures are logged and never block the agent (exit 0).
 */

const fs = require('node:fs');
const path = require('node:path');

let prettier;
try {
  prettier = require('prettier');
} catch (error) {
  console.error(
    `[format-md] prettier is not installed: ${error instanceof Error ? error.message : error}`,
  );
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
  console.error(`[format-md] ${message}`);
  process.exit(0);
}

/**
 * Formats one Markdown file in place. Prettier's parser is forced to markdown.
 * @param {string} filePath - Absolute or project-relative path from the hook payload
 * @returns {Promise<void>}
 */
async function formatMarkdown(filePath) {
  const root = process.env.CURSOR_PROJECT_DIR || process.cwd();
  const resolved = path.resolve(root, filePath);
  const source = fs.readFileSync(resolved, 'utf8');
  const formatted = await prettier.format(source, {
    filepath: resolved,
    parser: 'markdown',
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

  if (path.extname(filePath).toLowerCase() !== '.md') {
    process.exit(0);
  }

  try {
    await formatMarkdown(filePath);
  } catch (error) {
    failOpen(error instanceof Error ? error.message : String(error));
  }
}

main().catch((error) => {
  failOpen(error instanceof Error ? error.message : String(error));
});
