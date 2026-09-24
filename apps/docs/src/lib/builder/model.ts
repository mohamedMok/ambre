import data from '@ambre-ds/tokens/json';
import pairsJson from '../../../../../packages/tokens/src/contrast-pairs.json';
import { contrast, parseColor } from './color';

interface CompiledToken {
	path: string;
	css: string | null;
	value: string | number;
	type: string;
	description: string;
}

const compiled = data as unknown as {
	system: CompiledToken[];
	dark: CompiledToken[];
	presets: Record<string, { name: string; light: CompiledToken[]; dark: CompiledToken[] }>;
};

export type GroupId = 'color' | 'type' | 'space' | 'size' | 'shape' | 'depth' | 'focus' | 'motion';
export type Theme = 'light' | 'dark';

export const groups: { id: GroupId; label: string; summary: string }[] = [
	{ id: 'color', label: 'Color', summary: 'Surfaces, text, borders, accent, status. Set for light and dark.' },
	{ id: 'type', label: 'Typography', summary: 'Families, the size scale, weights, and line heights.' },
	{ id: 'space', label: 'Space', summary: 'The spacing scale every layout and control uses.' },
	{ id: 'size', label: 'Size', summary: 'Control heights and icon boxes.' },
	{ id: 'shape', label: 'Shape', summary: 'Corner radii and stroke widths.' },
	{ id: 'depth', label: 'Depth', summary: 'Elevation shadows, per theme, and the overlay scrim.' },
	{ id: 'focus', label: 'Focus', summary: 'The focus ring and its halo.' },
	{ id: 'motion', label: 'Motion', summary: 'Durations and easing curves.' }
];

export interface TokenDef {
	path: string;
	css: string;
	type: string;
	description: string;
	/** The dark-theme wording, for themed tokens whose description names the theme. */
	descriptionDark: string;
	themed: boolean;
	group: GroupId;
	label: string;
}

function groupOf(path: string): GroupId {
	if (path.startsWith('color.')) return 'color';
	if (path.startsWith('font.')) return 'type';
	if (path.startsWith('space.')) return 'space';
	if (path.startsWith('size.')) return 'size';
	if (path.startsWith('radius.') || path.startsWith('border.')) return 'shape';
	if (path.startsWith('elevation.') || path.startsWith('opacity.')) return 'depth';
	if (path.startsWith('focus.')) return 'focus';
	return 'motion';
}

const themedPaths = new Set(compiled.dark.map((token) => token.path));
const darkDescriptions = new Map(compiled.dark.map((token) => [token.path, token.description]));

export const defs: TokenDef[] = compiled.system
	.filter((token) => token.css)
	.map((token) => {
		const group = groupOf(token.path);
		const trimmed = token.path.split('.');
		// Drop the family prefix the group already names: color.bg.canvas → bg.canvas.
		const label = ['color', 'font', 'size', 'elevation', 'opacity'].includes(trimmed[0])
			? trimmed.slice(1).join('.')
			: token.path;
		return {
			path: token.path,
			css: token.css as string,
			type: token.type,
			description: token.description,
			descriptionDark: darkDescriptions.get(token.path) || token.description,
			themed: themedPaths.has(token.path),
			group,
			label
		};
	});

export const defsByPath = new Map(defs.map((def) => [def.path, def]));

export type Values = Record<string, string>;

export interface BuilderState {
	name: string;
	id: string;
	description: string;
	base: string;
	shared: Values;
	light: Values;
	dark: Values;
}

const toMap = (list: CompiledToken[]) => Object.fromEntries(list.map((token) => [token.path, String(token.value)]));

/** Every token's value for a starting brand: Ambre, or a preset laid over Ambre. */
export function fromBrand(id: string): BuilderState {
	let light: Values = toMap(compiled.system);
	let dark: Values = { ...light, ...toMap(compiled.dark) };
	const preset = compiled.presets[id];
	if (preset) {
		light = { ...light, ...toMap(preset.light) };
		dark = { ...dark, ...toMap(preset.dark) };
	}
	const state: BuilderState = {
		name: 'My brand',
		id: 'my-brand',
		description: '',
		base: preset ? id : 'ambre',
		shared: {},
		light: {},
		dark: {}
	};
	for (const def of defs) {
		if (def.themed) {
			state.light[def.path] = light[def.path];
			state.dark[def.path] = dark[def.path];
		} else {
			state.shared[def.path] = light[def.path];
		}
	}
	return state;
}

export function valueOf(state: BuilderState, def: TokenDef, theme: Theme) {
	return def.themed ? state[theme][def.path] : state.shared[def.path];
}

export function setValue(state: BuilderState, def: TokenDef, theme: Theme, value: string) {
	if (def.themed) state[theme][def.path] = value;
	else state.shared[def.path] = value;
}

/** The inline style that scopes every token to the preview. */
export function styleFor(state: BuilderState, theme: Theme) {
	return defs.map((def) => `${def.css}: ${valueOf(state, def, theme)}`).join('; ');
}

// ---------- Contrast ----------

export interface PairResult {
	fg: string;
	bg: string;
	theme: Theme;
	min: number;
	purpose: string;
	ratio: number;
	pass: boolean;
}

const pairs = pairsJson as { fg: string; bg: string; theme: Theme; min: number; purpose: string }[];

export function checkPairs(state: BuilderState): PairResult[] {
	return pairs.map((pair) => {
		const fg = state[pair.theme][pair.fg] ?? state.shared[pair.fg];
		const bg = state[pair.theme][pair.bg] ?? state.shared[pair.bg];
		const ratio = Math.round(contrast(fg, bg) * 100) / 100;
		return { ...pair, ratio, pass: ratio + 0.001 >= pair.min };
	});
}

// ---------- Export ----------

function slug(text: string) {
	return (
		text
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.replace(/^[^a-z]+/, '') || 'my-brand'
	);
}

export function brandId(state: BuilderState) {
	return slug(state.id || state.name);
}

/** CSS string → the DTCG value shape the preset files use. */
function toDtcg(def: TokenDef, css: string): unknown {
	switch (def.type) {
		case 'color': {
			const rgba = parseColor(css);
			if (!rgba) return css;
			const hex = `#${[rgba.r, rgba.g, rgba.b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')}`;
			if (rgba.a >= 1) return hex;
			return {
				colorSpace: 'srgb',
				components: [rgba.r, rgba.g, rgba.b].map((n) => Math.round((n / 255) * 10000) / 10000),
				alpha: Math.round(rgba.a * 100) / 100,
				hex
			};
		}
		case 'dimension': {
			const match = /^(-?[\d.]+)(px|rem|em|%)?$/.exec(css.trim());
			return match ? { value: Number(match[1]), unit: match[2] ?? 'px' } : css;
		}
		case 'fontFamily':
			return css.split(',').map((face) => face.trim().replace(/^['"]|['"]$/g, ''));
		case 'fontWeight':
		case 'number':
			return Number(css);
		case 'cubicBezier': {
			const numbers = /cubic-bezier\(([^)]+)\)/.exec(css)?.[1].split(',').map(Number);
			return numbers && numbers.length === 4 ? numbers : css;
		}
		default:
			return css;
	}
}

function place(root: Record<string, unknown>, path: string, leaf: unknown) {
	const parts = path.split('.');
	let node = root;
	for (const part of parts.slice(0, -1)) node = (node[part] ??= {}) as Record<string, unknown>;
	node[parts[parts.length - 1]] = leaf;
}

/** The preset file, in the shape of packages/tokens/src/preset/<id>.json. */
export function presetJson(state: BuilderState) {
	const out: Record<string, unknown> = {
		name: state.name || 'My brand',
		description: state.description || `Made with the Ambre preset builder, starting from ${state.base}.`,
		shared: {},
		light: {},
		dark: {}
	};
	const ambre = fromBrand('ambre');
	for (const def of defs) {
		// A changed value keeps only the generic first sentence: the rest names Ambre's own values.
		const describe = (value: string, original: string, text: string) =>
			value === original ? text : (text.split(/(?<=\.)\s/)[0] ?? text);
		const token = (value: string, original: string, text = def.description) => ({
			$type: def.type,
			$value: toDtcg(def, value),
			$description: describe(value, original, text)
		});
		if (def.themed) {
			place(out.light as Record<string, unknown>, def.path, token(state.light[def.path], ambre.light[def.path]));
			place(
				out.dark as Record<string, unknown>,
				def.path,
				token(state.dark[def.path], ambre.dark[def.path], def.descriptionDark)
			);
		} else {
			place(out.shared as Record<string, unknown>, def.path, token(state.shared[def.path], ambre.shared[def.path]));
		}
	}
	return JSON.stringify(out, null, 2) + '\n';
}

/** Ready-to-use CSS: load it after @ambre-ds/tokens/css and set data-brand. */
export function presetCss(state: BuilderState) {
	const id = brandId(state);
	const block = (selector: string, entries: [string, string][], extra = '') =>
		`${selector} {\n${extra}${entries.map(([name, value]) => `  ${name}: ${value};`).join('\n')}\n}`;
	const shared = defs.filter((def) => !def.themed).map((def) => [def.css, state.shared[def.path]] as [string, string]);
	const light = defs.filter((def) => def.themed).map((def) => [def.css, state.light[def.path]] as [string, string]);
	const dark = defs.filter((def) => def.themed).map((def) => [def.css, state.dark[def.path]] as [string, string]);
	return [
		`/* ${state.name || 'My brand'}: made with the Ambre preset builder. Load after @ambre-ds/tokens/css. */`,
		block(`[data-brand="${id}"]`, shared),
		block(`[data-brand="${id}"]:not([data-theme="dark"])`, light, '  color-scheme: light;\n'),
		block(`[data-brand="${id}"][data-theme="dark"]`, dark, '  color-scheme: dark;\n'),
		''
	].join('\n\n');
}

// ---------- Share link ----------

/** Encodes only what differs from the starting brand, so links stay short. */
export function encodeShare(state: BuilderState) {
	const base = fromBrand(state.base);
	const diff = (a: Values, b: Values) => Object.fromEntries(Object.entries(a).filter(([k, v]) => b[k] !== v));
	const payload = {
		v: 1,
		n: state.name,
		i: state.id,
		d: state.description,
		b: state.base,
		s: diff(state.shared, base.shared),
		l: diff(state.light, base.light),
		k: diff(state.dark, base.dark)
	};
	const bytes = new TextEncoder().encode(JSON.stringify(payload));
	let binary = '';
	bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShare(code: string): BuilderState | null {
	try {
		const binary = atob(code.replace(/-/g, '+').replace(/_/g, '/'));
		const payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))));
		if (payload.v !== 1) return null;
		const state = fromBrand(payload.b);
		const keep = (values: Values, into: Values) => {
			for (const [path, value] of Object.entries(values ?? {})) {
				if (path in into && typeof value === 'string') into[path] = value;
			}
		};
		keep(payload.s, state.shared);
		keep(payload.l, state.light);
		keep(payload.k, state.dark);
		state.name = String(payload.n ?? state.name);
		state.id = String(payload.i ?? state.id);
		state.description = String(payload.d ?? '');
		return state;
	} catch {
		return null;
	}
}

/** Reads a preset file back (the shape presetJson writes, or any file in packages/tokens/src/preset). */
export function importPreset(text: string, base: BuilderState): BuilderState {
	const file = JSON.parse(text);
	const next: BuilderState = structuredClone(base);
	next.name = file.name ?? next.name;
	next.description = file.description ?? '';
	const read = (node: unknown, path: string[] = []): [string, unknown][] => {
		if (!node || typeof node !== 'object') return [];
		const record = node as Record<string, unknown>;
		if ('$value' in record) return [[path.join('.'), record.$value]];
		return Object.entries(record).flatMap(([key, child]) => read(child, [...path, key]));
	};
	const toCss = (def: TokenDef, value: unknown): string => {
		if (typeof value === 'string') return value;
		if (typeof value === 'number') return String(value);
		if (Array.isArray(value)) {
			return def.type === 'cubicBezier'
				? `cubic-bezier(${value.join(', ')})`
				: value.map((face) => (/\s/.test(String(face)) ? `'${face}'` : String(face))).join(', ');
		}
		const object = value as Record<string, unknown>;
		if ('unit' in object) return `${object.value}${object.unit}`;
		if ('hex' in object) {
			const alpha = typeof object.alpha === 'number' ? object.alpha : 1;
			const rgba = parseColor(String(object.hex));
			return rgba && alpha < 1
				? `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`
				: String(object.hex);
		}
		return String(value);
	};
	for (const [scope, target] of [
		['shared', 'shared'],
		['light', 'light'],
		['dark', 'dark']
	] as const) {
		for (const [path, value] of read(file[scope])) {
			const def = defsByPath.get(path);
			if (!def) continue;
			const css = toCss(def, value);
			if (scope === 'shared' && def.themed) {
				next.light[path] = css;
				next.dark[path] = css;
			} else if (def.themed) {
				next[target === 'shared' ? 'light' : target][path] = css;
			} else {
				next.shared[path] = css;
			}
		}
	}
	return next;
}
