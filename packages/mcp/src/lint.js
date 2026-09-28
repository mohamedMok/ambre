/**
 * Lints the amb- markup of a project: HTML files strictly, component templates (Svelte, Vue,
 * JSX, TSX, Astro, Angular) in framework mode. Prints each problem as `file:line`, or as a
 * GitHub annotation inside GitHub Actions.
 */
import fs from 'node:fs';
import path from 'node:path';
import { validate } from './validate.js';

const extensions = new Set(['.html', '.htm', '.svelte', '.vue', '.jsx', '.tsx', '.astro', '.component.html']);
const skip = new Set(['node_modules', '.git', 'dist', 'build', '.svelte-kit', '.next', '.nuxt', '.output', 'storybook-static', 'coverage']);

function files(entry, found = []) {
	const stat = fs.statSync(entry, { throwIfNoEntry: false });
	if (!stat) return found;
	if (stat.isDirectory()) {
		if (skip.has(path.basename(entry))) return found;
		for (const child of fs.readdirSync(entry)) files(path.join(entry, child), found);
	} else if (extensions.has(path.extname(entry))) {
		found.push(entry);
	}
	return found;
}

/**
 * @param {string[]} entries files or folders
 * @param {{ write?: (line: string) => void, annotate?: boolean }} [options]
 * @returns {{ files: number, errors: number, warnings: number }}
 */
export function lint(entries, options = {}) {
	const write = options.write ?? ((line) => console.log(line));
	const annotate = options.annotate ?? process.env.GITHUB_ACTIONS === 'true';
	const totals = { files: 0, errors: 0, warnings: 0 };
	for (const file of entries.flatMap((entry) => files(entry))) {
		const source = fs.readFileSync(file, 'utf8');
		if (!source.includes('<amb-')) continue;
		totals.files += 1;
		const result = validate(source, { framework: !['.html', '.htm'].includes(path.extname(file)) });
		const issues = [
			...result.errors.map((issue) => ({ ...issue, level: 'error' })),
			...result.warnings.map((issue) => ({ ...issue, level: 'warning' }))
		].sort((a, b) => a.line - b.line);
		for (const issue of issues) {
			const message = `${issue.element} ${issue.message.replace(/`/g, "'")}`;
			write(annotate ? `::${issue.level} file=${file},line=${issue.line}::${message}` : `${file}:${issue.line}  ${issue.level}  ${message}`);
		}
		totals.errors += result.errors.length;
		totals.warnings += result.warnings.length;
	}
	return totals;
}
