/**
 * Every example must validate with no errors, and the validator must catch the mistakes it
 * exists for. Runs in `pnpm test`.
 */
import assert from 'node:assert/strict';
import { component, find, knowledge, llmsFull, llmsIndex, validate } from './src/index.js';

let failures = 0;
function check(name, fn) {
	try {
		fn();
	} catch (error) {
		failures += 1;
		console.error(`✗ ${name}\n  ${error.message}`);
	}
}

for (const example of knowledge.examples) {
	check(`example ${example.id} is valid`, () => {
		const result = validate(example.html);
		assert.deepEqual(result.errors.map((issue) => `line ${issue.line}: ${issue.message}`), []);
		assert.deepEqual(result.warnings.map((issue) => `line ${issue.line}: ${issue.message}`), []);
	});
}

const mistakes = [
	['an unknown element', '<amb-buton>Save</amb-buton>', /Unknown element.*amb-button/],
	['an unknown attribute', '<amb-button color="red">Save</amb-button>', /no `color` attribute/],
	['a close attribute', '<amb-button varient="ghost">Save</amb-button>', /Did you mean `variant`/],
	['a boolean set to false', '<amb-checkbox checked="false">News</amb-checkbox>', /makes it true/],
	['an enum value that does not exist', '<amb-button variant="danger">Delete</amb-button>', /not a value of variant/],
	['a number that is not one', '<amb-range value="half">Volume</amb-range>', /not a number/],
	['a slot that does not exist', '<amb-card><p slot="body">Text</p></amb-card>', /no `body` slot/],
	['a missing label', '<amb-button></amb-button>', /has no label/],
	['a link card without a heading', '<amb-card href="/x"><p>Text</p></amb-card>', /needs a `heading` slot/],
	['an inline handler for a custom event', '<amb-prompt onsend="go()">Message</amb-prompt>', /custom event/],
	['a slot on a grandchild', '<amb-card><div><h2 slot="heading">Title</h2></div></amb-card>', /not on a direct child/]
];

for (const [name, html, pattern] of mistakes) {
	check(`catches ${name}`, () => {
		const result = validate(html);
		const messages = [...result.errors, ...result.warnings].map((issue) => issue.message).join('\n');
		assert.match(messages, pattern);
	});
}

check('finds components by need', () => {
	assert.equal(find('pick a date')[0]?.tag, 'amb-date-picker');
	assert.equal(find('show a key figure and its change')[0]?.tag, 'amb-stat-tile');
	assert.equal(find('a step the agent took')[0]?.tag, 'amb-tool-call');
});

check('looks components up by tag, id, and title', () => {
	for (const name of ['amb-date-picker', 'date-picker', 'Date picker', '<amb-date-picker>']) {
		assert.equal(component(name)?.tag, 'amb-date-picker', name);
	}
});

check('llms.txt links every component and example', () => {
	const index = llmsIndex(knowledge);
	for (const c of knowledge.components) assert.ok(index.includes(`/llms/components/${c.id}.md`), c.id);
	for (const e of knowledge.examples) assert.ok(index.includes(`/llms/examples/${e.id}.md`), e.id);
	assert.ok(llmsFull(knowledge).includes('## <amb-date-picker>'));
});

if (failures) {
	console.error(`\n${failures} check${failures === 1 ? '' : 's'} failed`);
	process.exit(1);
}
console.log(`knowledge checks pass: ${knowledge.examples.length} examples valid, ${mistakes.length} mistakes caught`);
