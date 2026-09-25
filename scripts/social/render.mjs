/**
 * Renders the social preview images from the HTML in this folder with headless Chrome.
 * The pages read the built tokens and presets, so run `pnpm build` first.
 *
 *   pnpm social
 *
 * CHROME can point at another Chromium binary.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const chrome =
	process.env.CHROME ??
	['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(
		(candidate) => fs.existsSync(candidate)
	);

if (!chrome) {
	console.error('No Chrome found. Set CHROME to a Chromium binary.');
	process.exit(1);
}
if (!fs.existsSync(path.join(root, 'packages/tokens/dist/css/presets.css'))) {
	console.error('Build the tokens first: pnpm build');
	process.exit(1);
}

const images = [
	// Open Graph and Twitter cards for the site.
	{ page: 'card.html', out: 'apps/docs/static/social/ambre.png', width: 1200, height: 630 },
	{ page: 'builder.html', out: 'apps/docs/static/social/builder.png', width: 1200, height: 630 },
	// GitHub's repository social preview. Upload it in Settings → General → Social preview.
	{ page: 'card.html', out: '.github/social-preview.png', width: 1280, height: 640 },
	// Home-screen icon.
	{ page: 'icon.html', out: 'apps/docs/static/apple-touch-icon.png', width: 180, height: 180 }
];

for (const image of images) {
	const out = path.join(root, image.out);
	fs.mkdirSync(path.dirname(out), { recursive: true });
	execFileSync(chrome, [
		'--headless=new',
		'--disable-gpu',
		'--hide-scrollbars',
		'--allow-file-access-from-files',
		'--force-device-scale-factor=1',
		'--default-background-color=00000000',
		'--virtual-time-budget=3000',
		`--window-size=${image.width},${image.height}`,
		`--screenshot=${out}`,
		pathToFileURL(path.join(here, image.page)).href
	], { stdio: 'ignore' });
	console.log(`${image.out}  ${image.width}×${image.height}`);
}
