import { contrast, fitContrast, formatColor, oklch, withAlpha, type Rgba } from './color';
import type { BuilderState, GroupId, Values } from './model';

type Rand = () => number;

const pick = <T>(rand: Rand, list: readonly T[]) => list[Math.floor(rand() * list.length)];
const between = (rand: Rand, min: number, max: number) => min + rand() * (max - min);
const round = (n: number, step = 1) => Number((Math.round(n / step) * step).toFixed(4));
const px = (n: number) => `${round(n)}px`;

/** A small seeded generator, so a "roll" can be reproduced from its seed. */
export function seeded(seed: number): Rand {
	let t = seed >>> 0;
	return () => {
		t += 0x6d2b79f5;
		let r = Math.imul(t ^ (t >>> 15), 1 | t);
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
}

const hex = (color: Rgba) => formatColor({ ...color, a: 1 });
const alpha = (color: Rgba, a: number) => formatColor(withAlpha(color, a));
const shadow = (y: number, blur: number, spread: number, color: Rgba, a: number, inset = false) =>
	`${inset ? 'inset ' : ''}0px ${y}px ${blur}px ${spread}px ${alpha(color, a)}`;

// ---------- Color ----------

/** A full light and dark palette. Every text colour is walked in lightness until its contrast pairs pass. */
function colors(rand: Rand): { light: Values; dark: Values } {
	const accentHue = between(rand, 0, 360);
	const accentChroma = between(rand, 0.11, 0.19);
	// Neutrals lean toward the accent, or take their own temperature.
	const neutralHue = rand() < 0.6 ? accentHue + between(rand, -20, 20) : pick(rand, [60, 80, 220, 250, 160]);
	const neutralChroma = between(rand, 0.004, 0.022);
	const successHue = pick(rand, [150, 160, 190, 200]); // teal half the time: off the red–green axis
	const dangerHue = between(rand, 20, 32);
	const n = (l: number, c = neutralChroma) => oklch(l, c, neutralHue);
	const white = oklch(1, 0, 0);

	// Light
	const L: Record<string, Rgba> = {};
	L.canvas = n(between(rand, 0.965, 0.985));
	L.surface = rand() < 0.5 ? white : n(0.995, neutralChroma * 0.4);
	L.subtle = n(0.945);
	L.muted = n(0.905);
	L.inverse = n(0.2);
	L.disabled = n(0.925);
	L.fgDefault = fitContrast(0.22, neutralChroma * 1.3, neutralHue, [L.canvas, L.surface, L.subtle], 12, 'darker');
	L.fgMuted = fitContrast(0.42, neutralChroma * 1.4, neutralHue, [L.canvas], 7, 'darker');
	L.fgSubtle = fitContrast(0.5, neutralChroma * 1.4, neutralHue, [L.canvas], 4.5, 'darker');
	L.fgDisabled = fitContrast(0.55, neutralChroma, neutralHue, [L.disabled], 3, 'darker');
	L.border = fitContrast(0.62, neutralChroma * 1.6, neutralHue, [L.canvas, L.surface], 3, 'darker');
	L.borderStrong = L.fgMuted;
	L.borderDisabled = n(0.84);
	L.accent = fitContrast(0.6, accentChroma, accentHue, [white], 4.5, 'darker');
	L.accentFg = fitContrast(0.55, accentChroma, accentHue, [L.canvas, L.subtle, L.surface], 4.5, 'darker');
	const accentL = (target: Rgba, drop: number) => fitContrast(0.6 - drop, accentChroma, accentHue, [white], Math.max(4.5, contrast(target, white)), 'darker');
	L.accentHover = accentL(L.accent, 0.07);
	L.accentActive = accentL(L.accentHover, 0.13);
	L.danger = fitContrast(0.55, 0.17, dangerHue, [L.canvas, white], 4.5, 'darker');
	L.success = fitContrast(0.55, 0.12, successHue, [L.canvas, white], 4.5, 'darker');

	// Dark
	const D: Record<string, Rgba> = {};
	D.canvas = n(between(rand, 0.14, 0.18));
	D.surface = n(0.205);
	D.subtle = n(0.255);
	D.muted = n(0.31);
	D.inverse = n(0.97);
	D.disabled = n(0.255);
	D.fgDefault = fitContrast(0.96, neutralChroma, neutralHue, [D.canvas, D.surface, D.subtle], 12, 'lighter');
	D.fgMuted = fitContrast(0.8, neutralChroma * 1.2, neutralHue, [D.canvas], 7, 'lighter');
	D.fgSubtle = fitContrast(0.68, neutralChroma * 1.2, neutralHue, [D.canvas], 4.5, 'lighter');
	D.fgDisabled = fitContrast(0.55, neutralChroma, neutralHue, [D.disabled], 3, 'lighter');
	D.border = fitContrast(0.5, neutralChroma * 1.4, neutralHue, [D.canvas, D.surface], 3, 'lighter');
	D.borderStrong = D.fgMuted;
	D.borderDisabled = n(0.33);
	D.onAccent = D.canvas;
	D.accent = fitContrast(0.72, accentChroma, accentHue, [D.onAccent], 4.5, 'lighter');
	D.accentHover = fitContrast(0.8, accentChroma * 0.85, accentHue, [D.onAccent], 4.5, 'lighter');
	D.accentActive = fitContrast(0.66, accentChroma, accentHue, [D.onAccent], 4.5, 'lighter');
	D.accentFg = fitContrast(0.78, accentChroma * 0.85, accentHue, [D.canvas, D.subtle, D.surface], 4.5, 'lighter');
	D.danger = fitContrast(0.75, 0.13, dangerHue, [D.canvas], 4.5, 'lighter');
	D.success = fitContrast(0.78, 0.11, successHue, [D.canvas], 4.5, 'lighter');

	const common = (T: Record<string, Rgba>, theme: 'light' | 'dark'): Values => ({
		'color.bg.canvas': hex(T.canvas),
		'color.bg.surface': hex(T.surface),
		'color.bg.subtle': hex(T.subtle),
		'color.bg.muted': hex(T.muted),
		'color.bg.inverse': hex(T.inverse),
		'color.bg.disabled': hex(T.disabled),
		'color.fg.default': hex(T.fgDefault),
		'color.fg.muted': hex(T.fgMuted),
		'color.fg.subtle': hex(T.fgSubtle),
		'color.fg.inverse': hex(theme === 'light' ? L.canvas : L.fgDefault),
		'color.fg.on-accent': hex(theme === 'light' ? white : D.onAccent),
		'color.fg.disabled': hex(T.fgDisabled),
		'color.border.default': hex(T.border),
		'color.border.strong': hex(T.borderStrong),
		'color.border.disabled': hex(T.borderDisabled),
		'color.accent.bg': hex(T.accent),
		'color.accent.bg-hover': hex(T.accentHover),
		'color.accent.bg-active': hex(T.accentActive),
		'color.accent.fg': hex(T.accentFg),
		'color.focus.ring': hex(T.accentFg),
		'color.focus.halo': alpha(T.accent, theme === 'light' ? 0.22 : 0.28),
		'color.highlight': alpha(white, theme === 'light' ? between(rand, 0.25, 0.45) : between(rand, 0.06, 0.14)),
		// Solid status fills keep the light-theme colour with white text in both themes.
		'color.status.danger.fg': hex(T.danger),
		'color.status.danger.bg': hex(L.danger),
		'color.status.danger.on': hex(white),
		'color.status.success.fg': hex(T.success),
		'color.status.success.bg': hex(L.success),
		'color.status.success.on': hex(white)
	});

	return { light: common(L, 'light'), dark: common(D, 'dark') };
}

// ---------- Depth ----------

function depth(rand: Rand, light: Values, dark: Values): { light: Values; dark: Values; shared: Values } {
	const style = pick(rand, ['soft', 'soft', 'crisp', 'flat', 'offset'] as const);
	const inkLight = oklch(0.2, 0.02, 60);
	const inkDark = oklch(0.05, 0, 0);
	const make = (ink: Rgba, strength: number): Values => {
		switch (style) {
			case 'flat':
				return {
					'elevation.inset': shadow(0, 0, 0, ink, 0, true),
					'elevation.1': shadow(0, 0, 0, ink, 0),
					'elevation.2': shadow(2, 8, 0, ink, 0.08 * strength),
					'elevation.3': shadow(8, 24, 0, ink, 0.14 * strength)
				};
			case 'offset':
				return {
					'elevation.inset': shadow(0, 0, 0, ink, 0, true),
					'elevation.1': `2px 2px 0px 0px ${alpha(ink, Math.min(1, 0.9 * strength))}`,
					'elevation.2': `4px 4px 0px 0px ${alpha(ink, Math.min(1, 0.9 * strength))}`,
					'elevation.3': `8px 8px 0px 0px ${alpha(ink, Math.min(1, 0.9 * strength))}`
				};
			case 'crisp':
				return {
					'elevation.inset': shadow(1, 1, 0, ink, 0.06 * strength, true),
					'elevation.1': shadow(1, 1, 0, ink, 0.12 * strength),
					'elevation.2': shadow(4, 10, -2, ink, 0.14 * strength),
					'elevation.3': shadow(14, 32, -8, ink, 0.22 * strength)
				};
			default:
				return {
					'elevation.inset': shadow(1, 2, 0, ink, 0.08 * strength, true),
					'elevation.1': shadow(1, 2, 0, ink, 0.12 * strength),
					'elevation.2': shadow(4, 16, 0, ink, 0.12 * strength),
					'elevation.3': shadow(16, 40, 0, ink, 0.16 * strength)
				};
		}
	};
	void light;
	void dark;
	return {
		light: make(inkLight, 1),
		dark: make(inkDark, 4),
		shared: { 'opacity.scrim': String(round(between(rand, 0.4, 0.56), 0.02)) }
	};
}

// ---------- Type ----------

const faces = [
	`'Source Sans 3', 'Segoe UI', sans-serif`,
	`'Nunito Sans', 'Segoe UI', sans-serif`,
	`'Source Serif 4', Georgia, serif`,
	`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
];

function type(rand: Rand, density: number): Values {
	const base = pick(rand, [14, 15, 16, 16, 17, 18]) + (density - 1) * 1;
	const ratio = between(rand, 1.12, 1.26);
	// Steps 100–900 around the body size at step 300.
	const scale = [-2, -1, 0, 1, 2, 3, 4, 5, 6].map((step) => {
		const size = step < 0 ? base - (step === -2 ? 4 : 2) : base * ratio ** step;
		return px(Math.max(11, size));
	});
	const semibold = pick(rand, [600, 600, 700, 500]);
	const out: Values = {
		'font.family.sans': pick(rand, faces),
		'font.family.mono': `'Source Code Pro', ui-monospace, monospace`,
		'font.weight.regular': '400',
		'font.weight.medium': String(semibold >= 600 ? 500 : 500),
		'font.weight.semibold': String(semibold),
		'font.lineHeight.tight': String(round(between(rand, 1.1, 1.25), 0.05)),
		'font.lineHeight.body': String(round(between(rand, 1.45, 1.6), 0.05)),
		'font.lineHeight.loose': String(round(between(rand, 1.6, 1.8), 0.05))
	};
	scale.forEach((size, index) => (out[`font.size.${(index + 1) * 100}`] = size));
	return out;
}

// ---------- Space and size ----------

function space(rand: Rand, density: number): Values {
	const unit = pick(rand, [4, 4, 4, 5]) * [0.85, 1, 1.2][density];
	const steps = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24];
	return Object.fromEntries(steps.map((step, i) => [`space.${i * 100}`, px(step * unit)]));
}

function size(rand: Rand, density: number): Values {
	const md = [36, 44, 52][density] + pick(rand, [-4, 0, 0, 4]);
	return {
		'size.control.sm': px(Math.max(28, md - 12)),
		'size.control.md': px(md),
		'size.control.lg': px(md + 8),
		'size.icon.sm': px([14, 16, 18][density]),
		'size.icon.md': px([16, 20, 22][density]),
		'size.icon.lg': px([20, 24, 26][density])
	};
}

// ---------- Shape ----------

function shape(rand: Rand): Values {
	const style = pick(rand, ['sharp', 'subtle', 'round', 'round', 'soft'] as const);
	const radii = { sharp: [0, 0, 2], subtle: [4, 6, 8], round: [6, 10, 16], soft: [8, 12, 20] }[style];
	const pill = rand() < 0.3;
	const heavy = rand() < 0.2;
	return {
		'radius.none': '0px',
		'radius.sm': px(radii[0]),
		'radius.md': px(radii[1]),
		'radius.lg': px(radii[2]),
		'radius.full': '9999px',
		'radius.action': pill ? '9999px' : px(radii[1]),
		'border.width.default': heavy ? '2px' : '1px',
		'border.width.strong': heavy ? '3px' : '2px'
	};
}

// ---------- Focus ----------

function focus(rand: Rand): Values {
	return {
		'focus.ring.width': px(pick(rand, [2, 2, 3])),
		'focus.ring.offset': px(pick(rand, [2, 2, 3])),
		'focus.halo.width': px(pick(rand, [0, 3, 4, 4, 5]))
	};
}

// ---------- Motion ----------

function motion(rand: Rand): Values {
	const tempo = pick(rand, [
		{ fast: 100, moderate: 160, slow: 240, loop: 800 },
		{ fast: 120, moderate: 200, slow: 320, loop: 900 },
		{ fast: 160, moderate: 280, slow: 440, loop: 1200 }
	]);
	const spring = pick(rand, [
		'cubic-bezier(0.34, 1.56, 0.64, 1)',
		'cubic-bezier(0.3, 1.3, 0.6, 1)',
		'cubic-bezier(0.16, 1, 0.3, 1)',
		'cubic-bezier(0.2, 0, 0, 1)'
	]);
	return {
		'duration.fast': `${tempo.fast}ms`,
		'duration.moderate': `${tempo.moderate}ms`,
		'duration.slow': `${tempo.slow}ms`,
		'duration.loop': `${tempo.loop}ms`,
		'easing.standard': 'cubic-bezier(0.2, 0, 0, 1)',
		'easing.enter': pick(rand, ['cubic-bezier(0, 0, 0.2, 1)', 'cubic-bezier(0.16, 1, 0.3, 1)']),
		'easing.exit': 'cubic-bezier(0.4, 0, 1, 1)',
		'easing.spring': spring
	};
}

// ---------- Compose ----------

export type RandomScope = 'all' | GroupId;

/** Rolls new values for one group, or for everything, and writes them into a copy of the state. */
export function randomize(state: BuilderState, scope: RandomScope, seed = Math.floor(Math.random() * 2 ** 32)): BuilderState {
	const rand = seeded(seed);
	const next: BuilderState = structuredClone(state);
	const density = pick(rand, [0, 1, 1, 2]);
	const wants = (group: GroupId) => scope === 'all' || scope === group;
	const merge = (into: Values, values: Values) => {
		for (const [path, value] of Object.entries(values)) if (path in into) into[path] = value;
	};

	if (wants('color')) {
		const palette = colors(rand);
		merge(next.light, palette.light);
		merge(next.dark, palette.dark);
	}
	if (wants('depth')) {
		const d = depth(rand, next.light, next.dark);
		merge(next.light, d.light);
		merge(next.dark, d.dark);
		merge(next.shared, d.shared);
	}
	if (wants('type')) merge(next.shared, type(rand, density));
	if (wants('space')) merge(next.shared, space(rand, density));
	if (wants('size')) merge(next.shared, size(rand, density));
	if (wants('shape')) merge(next.shared, shape(rand));
	if (wants('focus')) merge(next.shared, focus(rand));
	if (wants('motion')) merge(next.shared, motion(rand));
	return next;
}
