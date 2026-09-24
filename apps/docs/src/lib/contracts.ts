import { parse } from 'yaml';
import { tokens } from './tokens';

export interface ContractProp {
	name: string;
	type: string;
	values?: string[];
	default?: string | number | boolean;
	attribute?: string;
	reflect?: boolean;
	description: string;
}

export interface Contract {
	id: string;
	tag: string;
	status: string;
	summary: string;
	anatomy: { id: string; element?: string; part?: string; slot?: string }[];
	props: ContractProp[];
	slots: { name: string; description: string }[];
	events: { name: string; description: string }[];
	a11y: { role: string; name: string; keyboard: string[]; notes: string[] };
	tokens: string[];
}

const raw = import.meta.glob('../../../../contracts/*.yaml', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const byId = new Map<string, Contract>();
for (const source of Object.values(raw)) {
	const contract = parse(source) as Contract;
	byId.set(contract.id, contract);
}

export function contract(id: string): Contract {
	const found = byId.get(id);
	if (!found) throw new Error(`No contract for ${id}`);
	return found;
}

export function packageFor(id: string) {
	return id === 'quantity' ? '@ambre/commerce' : '@ambre/ui';
}

export function sourcePath(c: Contract) {
	const name = c.tag
		.replace(/^amb-/, '')
		.split('-')
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join('');
	return c.id === 'quantity'
		? `packages/commerce/src/quantity/${name}.svelte`
		: `packages/ui/src/${c.id}/${name}.svelte`;
}

const system = new Map(tokens.system.map((token) => [token.path, token]));
const dark = new Map(tokens.dark.map((token) => [token.path, token]));

export function tokenInfo(path: string) {
	const light = system.get(path);
	return {
		path,
		css: light?.css ?? `--amb-${path.replaceAll('.', '-')}`,
		type: light?.type ?? 'unknown',
		light: light?.value,
		dark: dark.get(path)?.value ?? light?.value,
		description: light?.description ?? ''
	};
}
