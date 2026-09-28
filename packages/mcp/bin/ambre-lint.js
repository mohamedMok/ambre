#!/usr/bin/env node
/**
 * Checks the amb- markup of a project against the Ambre component contracts.
 *
 *   npx -y -p @ambre-ds/mcp ambre-lint src
 */
import { lint } from '../src/lint.js';

const entries = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
if (process.argv.includes('--help')) {
	console.log('Usage: ambre-lint [files or folders…]\nChecks HTML strictly, and Svelte, Vue, JSX, TSX, and Astro templates in framework mode.');
	process.exit(0);
}

const totals = lint(entries.length ? entries : ['.']);
const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
console.log(`\nambre-lint: ${plural(totals.errors, 'error')}, ${plural(totals.warnings, 'warning')} in ${plural(totals.files, 'file')} with amb- markup.`);
process.exit(totals.errors ? 1 : 0);
