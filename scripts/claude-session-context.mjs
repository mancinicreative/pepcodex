#!/usr/bin/env node
// SessionStart hook: inject current project state into Claude context.
// Prints to stdout; Claude Code surfaces it as additionalContext.

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const lines = [];

lines.push('# Project context (auto-loaded SessionStart hook)\n');

if (existsSync('.planning/STATE.md')) {
  const state = readFileSync('.planning/STATE.md', 'utf8').split('\n').slice(0, 40).join('\n');
  lines.push('## .planning/STATE.md (first 40 lines)\n');
  lines.push(state);
  lines.push('');
}

try {
  const log = execSync('git log --oneline -5', { encoding: 'utf8' });
  lines.push('## Recent commits\n');
  lines.push(log.trim());
} catch {}

process.stdout.write(lines.join('\n'));
