/**
 * Compiles what an AI tool needs to know about Ambre into dist/knowledge.json:
 * every contract, the examples, and the guidelines. The contracts are the API, so the
 * knowledge can never drift from the code; CI already fails when code and contract differ.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const packs = ['ui', 'commerce', 'ai'];

function packageOf(id) {
	const pack = packs.find((name) => fs.existsSync(path.join(root, 'packages', name, 'src', id)));
	return pack ? `@ambre-ds/${pack}` : '@ambre-ds/ui';
}

/** The title of a component: the id in words, as the documentation names it. */
function titleOf(id) {
	const words = id.split('-').join(' ');
	return words[0].toUpperCase() + words.slice(1);
}

const components = fs
	.readdirSync(path.join(root, 'contracts'))
	.filter((file) => file.endsWith('.yaml'))
	.sort()
	.map((file) => {
		const contract = parse(fs.readFileSync(path.join(root, 'contracts', file), 'utf8'));
		return {
			id: contract.id,
			tag: contract.tag,
			title: titleOf(contract.id),
			package: packageOf(contract.id),
			status: contract.status,
			summary: contract.summary,
			props: contract.props,
			slots: contract.slots,
			events: contract.events,
			parts: contract.anatomy.filter((part) => part.part).map((part) => ({ name: part.part, element: part.element ?? part.id })),
			a11y: contract.a11y,
			tokens: contract.tokens
		};
	});

/** An example is an HTML file whose first comment holds `key: value` lines. */
const examples = fs
	.readdirSync(path.join(root, 'examples'))
	.filter((file) => file.endsWith('.html'))
	.sort()
	.map((file) => {
		const source = fs.readFileSync(path.join(root, 'examples', file), 'utf8');
		const head = source.match(/^<!--([\s\S]*?)-->\s*/);
		const meta = Object.fromEntries(
			(head?.[1] ?? '')
				.split('\n')
				.map((line) => line.match(/^\s*(\w+):\s*(.+)$/))
				.filter(Boolean)
				.map((match) => [match[1], match[2].trim()])
		);
		const html = source.slice(head?.[0].length ?? 0).trim();
		const tags = [...new Set(html.match(/<amb-[a-z-]+/g)?.map((tag) => tag.slice(1)) ?? [])].sort();
		return {
			id: file.replace(/\.html$/, ''),
			title: meta.title ?? file,
			summary: meta.summary ?? '',
			topics: (meta.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean),
			components: tags,
			html
		};
	});

const unknown = examples.flatMap((example) =>
	example.components.filter((tag) => !components.some((c) => c.tag === tag)).map((tag) => `${example.id}: ${tag}`)
);
if (unknown.length) {
	console.error(`Examples use elements with no contract:\n${unknown.join('\n')}`);
	process.exit(1);
}

const version = JSON.parse(fs.readFileSync(path.join(root, 'packages/ui/package.json'), 'utf8')).version;
const knowledge = {
	version,
	site: 'https://mohamedmok-ambre.surge.sh',
	guidelines: fs.readFileSync(path.join(here, 'guidelines.md'), 'utf8'),
	components,
	examples
};

fs.mkdirSync(path.join(here, 'dist'), { recursive: true });
fs.writeFileSync(path.join(here, 'dist/knowledge.json'), JSON.stringify(knowledge, null, '\t') + '\n');

// The usage skill, for Claude Code and other agents that read SKILL.md files.
const { skill } = await import('./src/markdown.js');
fs.mkdirSync(path.join(here, 'dist/skill'), { recursive: true });
fs.writeFileSync(path.join(here, 'dist/skill/SKILL.md'), skill(knowledge));

console.log(`knowledge: ${components.length} components, ${examples.length} examples, version ${version}`);
