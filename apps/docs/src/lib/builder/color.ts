/** Colour maths for the preset builder: parsing CSS colours, WCAG contrast, and OKLCH. */

export interface Rgba {
	r: number; // 0–255
	g: number;
	b: number;
	a: number; // 0–1
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Parses the colour forms the tokens emit: #rgb, #rrggbb, #rrggbbaa, rgb()/rgba() with numbers or percentages. */
export function parseColor(input: string): Rgba | null {
	const value = input.trim().toLowerCase();
	let match = /^#([0-9a-f]{3,8})$/.exec(value);
	if (match) {
		let hex = match[1];
		if (hex.length === 3 || hex.length === 4) hex = [...hex].map((c) => c + c).join('');
		if (hex.length !== 6 && hex.length !== 8) return null;
		const n = (i: number) => parseInt(hex.slice(i, i + 2), 16);
		return { r: n(0), g: n(2), b: n(4), a: hex.length === 8 ? n(6) / 255 : 1 };
	}
	match = /^rgba?\(([^)]+)\)$/.exec(value);
	if (match) {
		const parts = match[1].split(/[\s,/]+/).filter(Boolean);
		if (parts.length < 3) return null;
		const channel = (part: string) => (part.endsWith('%') ? (parseFloat(part) / 100) * 255 : parseFloat(part));
		const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
		return { r: channel(parts[0]), g: channel(parts[1]), b: channel(parts[2]), a: clamp(alpha) };
	}
	return null;
}

const hex2 = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0');

export function toHex({ r, g, b }: Rgba) {
	return `#${hex2(r)}${hex2(g)}${hex2(b)}`;
}

/** The CSS string the tokens use: a 6-digit hex when opaque, rgba() otherwise. */
export function formatColor(color: Rgba) {
	if (color.a >= 1) return toHex(color);
	const round = (n: number) => Math.round(clamp(n, 0, 255));
	return `rgba(${round(color.r)}, ${round(color.g)}, ${round(color.b)}, ${Math.round(color.a * 100) / 100})`;
}

function linear(channel: number) {
	const c = channel / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2 relative luminance. Alpha is ignored: pairs are checked on opaque colours. */
export function luminance(color: Rgba) {
	return 0.2126 * linear(color.r) + 0.7152 * linear(color.g) + 0.0722 * linear(color.b);
}

export function contrast(a: Rgba | string, b: Rgba | string) {
	const x = typeof a === 'string' ? parseColor(a) : a;
	const y = typeof b === 'string' ? parseColor(b) : b;
	if (!x || !y) return 0;
	const l1 = luminance(x);
	const l2 = luminance(y);
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** OKLCH (L 0–1, C ≈ 0–0.37, h degrees) to sRGB, clipped to the gamut. */
export function oklch(l: number, c: number, h: number, alpha = 1): Rgba {
	const rad = (h * Math.PI) / 180;
	const a = c * Math.cos(rad);
	const b = c * Math.sin(rad);
	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
	const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
	const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
	const encode = (v: number) => {
		const x = clamp(v);
		return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
	};
	return { r: encode(lr), g: encode(lg), b: encode(lb), a: alpha };
}

/**
 * Walks the lightness of an OKLCH colour, darker or lighter, until it reaches `min` contrast
 * against every ground. Returns the first colour that passes, or the extreme it reached.
 */
export function fitContrast(
	l: number,
	c: number,
	h: number,
	grounds: (Rgba | string)[],
	min: number,
	direction: 'darker' | 'lighter'
): Rgba {
	const step = direction === 'darker' ? -0.005 : 0.005;
	let lightness = l;
	for (let i = 0; i < 220; i += 1) {
		const candidate = oklch(lightness, c, h);
		if (grounds.every((ground) => contrast(candidate, ground) >= min + 0.05)) return candidate;
		lightness = clamp(lightness + step);
		if (lightness === 0 || lightness === 1) break;
	}
	return oklch(lightness, c, h);
}

export function withAlpha(color: Rgba, a: number): Rgba {
	return { ...color, a };
}
