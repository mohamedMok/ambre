import base from './base.scss?inline';

/*
 * Component styles live in src/styles and compile to CSS strings. Each string becomes ONE
 * constructable stylesheet shared by every instance of the element, so a page with a hundred
 * buttons parses the button CSS once.
 */
const sheets = new Map<string, CSSStyleSheet>();
const constructable =
	typeof Document !== 'undefined' &&
	'adoptedStyleSheets' in Document.prototype &&
	'replaceSync' in CSSStyleSheet.prototype;

function sheetFor(css: string) {
	let sheet = sheets.get(css);
	if (!sheet) {
		sheet = new CSSStyleSheet();
		sheet.replaceSync(css);
		sheets.set(css, sheet);
	}
	return sheet;
}

/** Gives a shadow root the base sheet and its component sheet. Call it from the element's constructor. */
export function adopt(root: ShadowRoot | null | undefined, css: string) {
	if (!root) return;
	if (constructable) {
		const own = [sheetFor(base), sheetFor(css)];
		root.adoptedStyleSheets = [...root.adoptedStyleSheets.filter((sheet) => !own.includes(sheet)), ...own];
		return;
	}
	// Older engines: one style element per root.
	const style = document.createElement('style');
	style.textContent = `${base}\n${css}`;
	root.prepend(style);
}
