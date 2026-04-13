import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.resolve(__dirname, '../public/og-default.svg');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file:///' + svgPath.split(path.sep).join('/'));
await page.screenshot({ path: path.resolve(__dirname, '../public/og-default.png'), type: 'png' });
await browser.close();
console.log('Created og-default.png (1200x630)');
