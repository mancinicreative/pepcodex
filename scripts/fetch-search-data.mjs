// Compatibility CLI: every data write belongs to the immutable snapshot exporters.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { probe } from './gsc-probe.mjs';
import { classifyGoogleError, safeError } from './lib/google-auth.mjs';
const args = process.argv.slice(2);
try {
  if (args.includes('--whoami') || args.includes('--list-sites')) {
    const report = await probe({ identityOnly: args.includes('--whoami'), sitesOnly: true });
    console.log(JSON.stringify(report, null, 2));
    if (report.status !== 'SUCCESS') process.exitCode = 1;
  } else {
    const selected = args.includes('--gsc') && !args.includes('--ga4') ? ['gsc'] : args.includes('--ga4') && !args.includes('--gsc') ? ['ga4'] : ['gsc', 'ga4'];
    const forwarded = args.filter(arg => !['--gsc', '--ga4'].includes(arg));
    if (selected.length > 1 && forwarded.some(arg => arg.startsWith('--out='))) throw safeError('CLI_CONFIGURATION', 'Choose --gsc or --ga4 when supplying --out.');
    for (const source of selected) {
      const flags = forwarded.filter(arg => source === 'gsc' ? !arg.startsWith('--property=') : !arg.startsWith('--site='));
      const result = spawnSync(process.execPath, [fileURLToPath(new URL(source === 'gsc' ? './gsc-repull.mjs' : './ga4-pull.mjs', import.meta.url)), ...flags], { stdio: 'inherit', env: process.env });
      if (result.error) throw result.error;
      // Stop this invocation on failure; an auth error must not trigger another
      // exporter with the same rejected credential. Existing snapshots are retained.
      if (result.status !== 0) { process.exitCode = result.status || 1; break; }
    }
  }
} catch (error) { console.error(JSON.stringify(classifyGoogleError(error))); process.exitCode = 1; }
