'use strict';

/**
 * stop hook. Runs `npm run typecheck` (`tsc --noEmit` on the whole project).
 * When typecheck fails and the agent finished normally, prints a followup_message
 * so Cursor sends the errors back. Prints nothing and exits 0 when typecheck passes.
 * Hook failures are logged and do not block the agent.
 */

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

/**
 * Reads the hook payload Cursor writes to stdin.
 * @returns The raw stdin string
 */
function readStdin() {
  return fs.readFileSync(0, 'utf8');
}

/**
 * Reports a hook failure and lets the agent stop.
 * @param {string} message - What went wrong, without a stack trace
 */
function failOpen(message) {
  console.error(`[check-ts] ${message}`);
  process.exit(0);
}

/**
 * Runs the repo typecheck script. tsc checks every included project file, not one file.
 * @param {string} root - Project root, where package.json lives
 * @returns The spawn result from `npm run typecheck`
 */
function runTypecheck(root) {
  return spawnSync('npm', ['--silent', 'run', 'typecheck'], {
    cwd: root,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    timeout: 120000,
  });
}

/**
 * Handles one stop payload.
 */
function main() {
  let raw = '';
  try {
    raw = readStdin();
  } catch (error) {
    failOpen(`could not read stdin: ${error instanceof Error ? error.message : error}`);
    return;
  }

  let input = {};
  if (raw.trim()) {
    try {
      input = JSON.parse(raw);
    } catch (error) {
      failOpen(`invalid JSON on stdin: ${error instanceof Error ? error.message : error}`);
      return;
    }
  }

  // An aborted turn or an agent error should not start another turn.
  if (input.status === 'aborted' || input.status === 'error') {
    process.exit(0);
  }

  const root = process.env.CURSOR_PROJECT_DIR || process.cwd();
  const result = runTypecheck(root);

  if (result.error || result.status === null) {
    const detail = result.error instanceof Error ? result.error.message : 'typecheck did not finish';
    failOpen(detail);
  }

  if (result.status === 0) {
    process.exit(0);
  }

  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
  const body = output || `npm run typecheck exited with code ${result.status}`;
  const payload = `${JSON.stringify({ followup_message: `Fix these errors:\n${body}` })}\n`;
  process.stdout.write(payload, () => {
    process.exit(0);
  });
}

try {
  main();
} catch (error) {
  failOpen(error instanceof Error ? error.message : String(error));
}
