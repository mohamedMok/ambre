import data from '@ambre/tokens/json';

export interface TokenRecord {
	path: string;
	css: string | null;
	value: string | number;
	type: string;
	description: string;
}

export const tokens = data as {
	reference: TokenRecord[];
	system: TokenRecord[];
	dark: TokenRecord[];
};

export function byPrefix(list: TokenRecord[], prefix: string) {
	return list.filter((token) => token.path.startsWith(prefix));
}

export function families(list: TokenRecord[]) {
	const groups = new Map<string, TokenRecord[]>();
	for (const token of list) {
		const family = token.path.split('.')[1] ?? 'other';
		const current = groups.get(family) ?? [];
		current.push(token);
		groups.set(family, current);
	}
	return [...groups.entries()];
}
