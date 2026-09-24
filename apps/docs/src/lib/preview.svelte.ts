/** The brand every live example on the site renders in. The site chrome always stays Ambre. */
const KEY = 'amb-preview-brand';

function initial() {
	if (typeof localStorage === 'undefined') return 'ambre';
	try {
		return localStorage.getItem(KEY) || 'ambre';
	} catch {
		return 'ambre';
	}
}

export const preview = $state({ brand: 'ambre', ready: false });

export function hydratePreview() {
	preview.brand = initial();
	preview.ready = true;
}

export function setPreviewBrand(id: string) {
	preview.brand = id;
	try {
		localStorage.setItem(KEY, id);
	} catch {
		// Storage can be blocked. The choice still applies for this visit.
	}
}
