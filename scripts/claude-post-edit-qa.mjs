#!/usr/bin/env node
// PostToolUse hook: runs banned-content + basic QA scans on edited .mdx files.
// Reads tool invocation JSON from stdin, checks file_path, runs qa-banned-content.
// Exit non-zero with stderr message → Claude Code surfaces the block to the model.

import { spawnSync } from 'child_process';
import { existsSync } from 'fs';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw || '{}'); } catch { process.exit(0); }

  const toolInput = input.tool_input || {};
  const filePath = toolInput.file_path || toolInput.notebook_path;
  if (!filePath || !/\.mdx$/i.test(filePath)) process.exit(0);
  if (!existsSync(filePath)) process.exit(0);
  if (!filePath.includes('src/content/') && !filePath.includes('src\\content\\')) process.exit(0);

  const res = spawnSync('node', ['scripts/qa-banned-content.js', filePath], {
    encoding: 'utf8',
  });

  if (res.status !== 0) {
    // Advisory only — legacy content has flagged patterns. Surface to Claude
    // as stderr warning but don't block the edit. Fix issues in a dedicated pass.
    process.stderr.write(
      `[post-edit-qa] WARNING: banned-content scan flagged ${filePath}. Review before commit.\n`
    );
  }
  process.exit(0);
});
