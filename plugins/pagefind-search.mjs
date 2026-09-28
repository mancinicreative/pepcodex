import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

const run = promisify(execFile);
const runner = fileURLToPath(new URL('./runner/bin.cjs', import.meta.resolve('pagefind')));

/** Build the search index before the deployment adapter copies the client files. */
export default function pagefindSearch() {
  return {
    name: 'pepcodex-pagefind',
    hooks: {
      'astro:build:generated': async ({ dir, logger }) => {
        // Astro supplies the actual client directory, including for adapter builds.
        const site = await fs.realpath(fileURLToPath(dir));
        if (!(await fs.stat(site)).isDirectory()) throw new Error('Pagefind site must be a directory');
        const bundle = path.join(site, 'pagefind');
        const removeBundle = async () => {
          const existing = await fs.lstat(bundle).catch(error => {
            if (error.code !== 'ENOENT') throw error;
            return null;
          });
          if (existing?.isSymbolicLink()) throw new Error('Refusing a linked Pagefind output directory');
          // This fixed child of the resolved generated directory is owned by Pagefind.
          await fs.rm(bundle, { recursive: true, force: true });
        };
        await removeBundle();
        try {
          // Running the locked CLI directly preserves its nonzero failure exit.
          const { stdout, stderr } = await run(process.execPath, [
            runner, '--site', site, '--output-path', bundle,
          ], { windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
          const entry = JSON.parse(await fs.readFile(path.join(bundle, 'pagefind-entry.json'), 'utf8'));
          const pages = Object.values(entry.languages ?? {}).reduce((sum, language) => {
            if (!Number.isInteger(language.page_count) || language.page_count < 0) {
              throw new Error('Pagefind returned an invalid page count');
            }
            return sum + language.page_count;
          }, 0);
          if (pages < 1 || (await fs.stat(path.join(bundle, 'pagefind.js'))).size < 1) {
            throw new Error('Pagefind did not generate a nonempty search index');
          }
          if (stdout.trim()) logger.info(stdout.trim());
          if (stderr.trim()) logger.warn(stderr.trim());
        } catch (error) {
          await removeBundle();
          throw error;
        }
      },
    },
  };
}
