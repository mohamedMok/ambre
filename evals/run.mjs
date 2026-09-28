#!/usr/bin/env node
/**
 * Ambre Eval: can a model write correct Ambre markup, and how much do the skill and the MCP
 * tools help? Each task is a screen to build. Each condition gives the model different help:
 *
 *   none   the model's own knowledge
 *   skill  the usage skill (guidelines and component index) in the system prompt
 *   mcp    the Ambre tools through tool calling: the same definitions as the MCP server
 *
 * Every answer is checked by the validator in @ambre-ds/mcp, against the component contracts.
 *
 *   ANTHROPIC_API_KEY=… pnpm eval
 *   OPENAI_API_KEY=… pnpm eval --provider openai --model <model>
 *   pnpm eval --provider mock          # no API: checks the pipeline end to end
 *
 * Options: --model, --conditions none,skill,mcp, --tasks id,id, --limit n, --runs n, --concurrency n.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { find, instructions, jsonSchema, knowledge, skill, tools, validate } from '@ambre-ds/mcp';

const here = path.dirname(fileURLToPath(import.meta.url));
const { values: options } = parseArgs({
	options: {
		provider: { type: 'string', default: 'anthropic' },
		model: { type: 'string' },
		conditions: { type: 'string', default: 'none,skill,mcp' },
		tasks: { type: 'string' },
		limit: { type: 'string' },
		runs: { type: 'string', default: '1' },
		concurrency: { type: 'string', default: '4' },
		'max-turns': { type: 'string', default: '12' }
	}
});

const provider = options.provider;
const model = options.model ?? { anthropic: 'claude-sonnet-5', mock: 'mock' }[provider];
if (!model) {
	console.error(`Pass --model for the ${provider} provider.`);
	process.exit(1);
}
const conditions = options.conditions.split(',').map((item) => item.trim());
const maxTurns = Number(options['max-turns']);

let tasks = JSON.parse(fs.readFileSync(path.join(here, 'tasks.json'), 'utf8'));
if (options.tasks) tasks = tasks.filter((task) => options.tasks.split(',').includes(task.id));
if (options.limit) tasks = tasks.slice(0, Number(options.limit));

const base =
	'You are a senior front-end engineer. Build the requested screen with the Ambre design system: ' +
	'amb-* web components from the @ambre-ds packages. Assume the packages, the tokens, and the fonts are already loaded. ' +
	'Answer with the markup only, as one ```html block, with no explanation.';

const systems = {
	none: base,
	skill: `${base}\n\n${skill(knowledge)}`,
	mcp: `${base}\n\n${instructions}`
};

// ─── Providers ────────────────────────────────────────────────────────────────

async function post(url, body, headers) {
	for (let attempt = 0; ; attempt += 1) {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'content-type': 'application/json', ...headers },
			body: JSON.stringify(body)
		});
		if (response.ok) return response.json();
		const retry = response.status === 429 || response.status >= 500;
		if (!retry || attempt >= 5) throw new Error(`${url} answered ${response.status}: ${(await response.text()).slice(0, 300)}`);
		await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
	}
}

function runTool(name, input, log) {
	const tool = tools.find((item) => item.name === name);
	log.push(name);
	return tool ? tool.run(input ?? {}) : { text: `No tool called ${name}.`, isError: true };
}

async function anthropic({ system, prompt, withTools }) {
	const key = process.env.ANTHROPIC_API_KEY;
	if (!key) throw new Error('Set ANTHROPIC_API_KEY.');
	const messages = [{ role: 'user', content: prompt }];
	const usage = { input: 0, output: 0 };
	const calls = [];
	for (let turn = 1; turn <= maxTurns; turn += 1) {
		const response = await post(
			'https://api.anthropic.com/v1/messages',
			{
				model,
				max_tokens: 8000,
				system,
				messages,
				...(withTools
					? { tools: tools.map((tool) => ({ name: tool.name, description: tool.description, input_schema: jsonSchema(tool) })) }
					: {})
			},
			{ 'x-api-key': key, 'anthropic-version': '2023-06-01' }
		);
		usage.input += response.usage?.input_tokens ?? 0;
		usage.output += response.usage?.output_tokens ?? 0;
		messages.push({ role: 'assistant', content: response.content });
		const uses = response.content.filter((block) => block.type === 'tool_use');
		if (response.stop_reason !== 'tool_use' || !uses.length) {
			const text = response.content.filter((block) => block.type === 'text').map((block) => block.text).join('\n');
			return { text, turns: turn, usage, calls };
		}
		messages.push({
			role: 'user',
			content: uses.map((use) => {
				const result = runTool(use.name, use.input, calls);
				return { type: 'tool_result', tool_use_id: use.id, content: result.text, is_error: result.isError };
			})
		});
	}
	throw new Error(`No final answer after ${maxTurns} turns.`);
}

async function openai({ system, prompt, withTools }) {
	const key = process.env.OPENAI_API_KEY;
	if (!key) throw new Error('Set OPENAI_API_KEY.');
	const messages = [
		{ role: 'system', content: system },
		{ role: 'user', content: prompt }
	];
	const usage = { input: 0, output: 0 };
	const calls = [];
	for (let turn = 1; turn <= maxTurns; turn += 1) {
		const response = await post(
			'https://api.openai.com/v1/chat/completions',
			{
				model,
				messages,
				...(withTools
					? {
							tools: tools.map((tool) => ({
								type: 'function',
								function: { name: tool.name, description: tool.description, parameters: jsonSchema(tool) }
							}))
						}
					: {})
			},
			{ authorization: `Bearer ${key}` }
		);
		usage.input += response.usage?.prompt_tokens ?? 0;
		usage.output += response.usage?.completion_tokens ?? 0;
		const message = response.choices[0].message;
		messages.push(message);
		if (!message.tool_calls?.length) return { text: message.content ?? '', turns: turn, usage, calls };
		for (const call of message.tool_calls) {
			const result = runTool(call.function.name, JSON.parse(call.function.arguments || '{}'), calls);
			messages.push({ role: 'tool', tool_call_id: call.id, content: result.text });
		}
	}
	throw new Error(`No final answer after ${maxTurns} turns.`);
}

/**
 * A stand-in model with no API, to check the pipeline: it invents elements with no help,
 * makes one classic mistake with the skill, and adapts a real example with the tools.
 */
async function mock({ condition, task }) {
	const calls = [];
	if (condition === 'none') {
		return {
			text: '```html\n<amb-form>\n  <amb-input label="Email" type="email"></amb-input>\n  <amb-button color="primary" onClick="save()">Save</amb-button>\n</amb-form>\n```',
			turns: 1,
			usage: { input: 0, output: 0 },
			calls
		};
	}
	if (condition === 'skill') {
		return {
			text: '```html\n<form>\n  <amb-text-field name="email" type="email">Email</amb-text-field>\n  <amb-checkbox name="terms" checked="false">I accept the terms</amb-checkbox>\n  <amb-button type="submit">Continue</amb-button>\n</form>\n```',
			turns: 1,
			usage: { input: 0, output: 0 },
			calls
		};
	}
	runTool('get_guidelines', {}, calls);
	const example = knowledge.examples.find((item) => task.expects.every((tag) => item.components.includes(tag))) ??
		knowledge.examples.find((item) => item.components.includes(task.expects[0]));
	const html = example ? example.html.replace(/<script[\s\S]*?<\/script>/g, '') : task.expects.map((tag) => `<${tag}>${tag}</${tag}>`).join('\n');
	runTool('validate_markup', { html }, calls);
	find(task.prompt);
	return { text: `\`\`\`html\n${html}\n\`\`\``, turns: 3, usage: { input: 0, output: 0 }, calls };
}

const providers = { anthropic, openai, mock };
if (!providers[provider]) {
	console.error(`Unknown provider ${provider}. Use anthropic, openai, or mock.`);
	process.exit(1);
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

const kinds = [
	['invented element', /Unknown element/],
	['invented attribute', /has no `[^`]+` attribute/],
	['invalid value', /not a value of|not a number/],
	['boolean set to false', /makes it true/],
	['invented slot', /has no `[^`]+` slot/],
	['missing label', /has no label/],
	['unnamed link', /needs a `heading` slot|needs title text/],
	['inline custom event', /custom event/]
];

function kindOf(message) {
	return kinds.find(([, pattern]) => pattern.test(message))?.[0] ?? 'other';
}

/** The last html block of the answer, or the answer itself when it is bare markup. */
function extract(text) {
	const blocks = [...text.matchAll(/```(?:html|svelte|vue|jsx|tsx)?[^\n]*\n([\s\S]*?)```/g)].map((match) => match[1]);
	return (blocks.at(-1) ?? text).trim();
}

function score(task, answer) {
	const html = extract(answer.text);
	const result = validate(html);
	const used = new Set(result.elements);
	return {
		html,
		valid: result.elements.length > 0 && result.errors.length === 0,
		usesAmbre: result.elements.length > 0,
		errors: result.errors.map((issue) => ({ kind: kindOf(issue.message), line: issue.line, message: issue.message })),
		warnings: result.warnings.length,
		invented: result.errors.some((issue) => kindOf(issue.message) === 'invented element'),
		coverage: task.expects.filter((tag) => used.has(tag)).length / task.expects.length,
		turns: answer.turns,
		calls: answer.calls,
		usage: answer.usage
	};
}

// ─── Run ──────────────────────────────────────────────────────────────────────

const jobs = [];
for (let run = 1; run <= Number(options.runs); run += 1) {
	for (const task of tasks) for (const condition of conditions) jobs.push({ task, condition, run });
}

const results = [];
let done = 0;
async function worker() {
	while (jobs.length) {
		const job = jobs.shift();
		const started = Date.now();
		try {
			const answer = await providers[provider]({
				condition: job.condition,
				task: job.task,
				system: systems[job.condition],
				prompt: job.task.prompt,
				withTools: job.condition === 'mcp'
			});
			results.push({ id: job.task.id, condition: job.condition, run: job.run, ms: Date.now() - started, ...score(job.task, answer) });
		} catch (error) {
			results.push({ id: job.task.id, condition: job.condition, run: job.run, failed: String(error.message ?? error) });
		}
		done += 1;
		process.stderr.write(`\r${done} of ${done + jobs.length} answers`);
	}
}
await Promise.all(Array.from({ length: Number(options.concurrency) }, worker));
process.stderr.write('\n');

// ─── Report ───────────────────────────────────────────────────────────────────

const percent = (value) => `${Math.round(value * 100)}%`;
const mean = (list) => (list.length ? list.reduce((sum, value) => sum + value, 0) / list.length : 0);

const summary = conditions.map((condition) => {
	const rows = results.filter((row) => row.condition === condition && !row.failed);
	return {
		condition,
		answers: rows.length,
		failed: results.filter((row) => row.condition === condition && row.failed).length,
		valid: mean(rows.map((row) => (row.valid ? 1 : 0))),
		errorsPerScreen: mean(rows.map((row) => row.errors.length)),
		invented: mean(rows.map((row) => (row.invented ? 1 : 0))),
		coverage: mean(rows.map((row) => row.coverage)),
		toolCalls: mean(rows.map((row) => row.calls.length)),
		tokens: { input: Math.round(mean(rows.map((row) => row.usage.input))), output: Math.round(mean(rows.map((row) => row.usage.output))) },
		byKind: Object.fromEntries(
			[...kinds.map(([kind]) => kind), 'other'].map((kind) => [
				kind,
				rows.reduce((sum, row) => sum + row.errors.filter((error) => error.kind === kind).length, 0)
			])
		)
	};
});

const date = new Date().toISOString().slice(0, 10);
const labels = { none: 'No help', skill: 'Skill in the prompt', mcp: 'MCP tools' };
const lines = [
	`# Ambre Eval: ${model}`,
	'',
	`${date} · ${provider} · ${tasks.length} screens × ${options.runs} run${options.runs === '1' ? '' : 's'} · Ambre ${knowledge.version}`,
	provider === 'mock' ? '\n> Mock provider: these numbers check the pipeline, not a model.\n' : '',
	'| Help | Valid screens | Errors per screen | Invented an element | Expected elements used | Tool calls | Tokens in / out |',
	'| --- | --- | --- | --- | --- | --- | --- |',
	...summary.map(
		(row) =>
			`| ${labels[row.condition] ?? row.condition} | **${percent(row.valid)}** | ${row.errorsPerScreen.toFixed(1)} | ${percent(row.invented)} | ${percent(row.coverage)} | ${row.toolCalls.toFixed(1)} | ${row.tokens.input} / ${row.tokens.output} |`
	),
	'',
	'## Errors by kind',
	'',
	`| Kind | ${summary.map((row) => labels[row.condition] ?? row.condition).join(' | ')} |`,
	`| --- | ${summary.map(() => '---').join(' | ')} |`,
	...[...kinds.map(([kind]) => kind), 'other'].map((kind) => `| ${kind} | ${summary.map((row) => row.byKind[kind]).join(' | ')} |`),
	'',
	'## Method',
	'',
	'- A screen is valid when it uses at least one Ambre element and the validator in `@ambre-ds/mcp` reports no error against the component contracts.',
	'- *Expected elements used* is the share of the elements a correct screen needs that the answer used, such as `amb-date-picker` for a booking.',
	'- The MCP condition gives the model the same tool definitions as the MCP server, through the provider’s tool calling.',
	`- Tasks: \`evals/tasks.json\`. Failed API calls: ${summary.reduce((sum, row) => sum + row.failed, 0)}.`,
	''
];

const outDir = path.join(here, 'results');
fs.mkdirSync(outDir, { recursive: true });
const name = `${date}-${provider}-${model.replace(/[^a-z0-9.-]+/gi, '-')}`;
fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify({ date, provider, model, version: knowledge.version, summary, results }, null, '\t') + '\n');
fs.writeFileSync(path.join(outDir, `${name}.md`), lines.join('\n'));
console.log(lines.join('\n'));
console.log(`Saved evals/results/${name}.md and .json`);
