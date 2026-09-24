import { presetList } from '@ambre/tokens';

export interface Brand {
	id: string;
	name: string;
	sector: string;
	summary: string;
	face: string;
}

const details: Record<string, Omit<Brand, 'id' | 'name'>> = {
	ambre: {
		sector: 'Default',
		summary: 'Warm paper and amber. Tactile layers, 10px corners, 44px controls.',
		face: 'Source Sans 3'
	},
	atlas: {
		sector: 'Enterprise and data',
		summary: 'Dense and calm. The system face at 14px, 36px controls, ink-blue actions on cool slate.',
		face: 'System UI'
	},
	verdant: {
		sector: 'Public services and health',
		summary: 'Accessibility first. 18px text, 52px controls, 2px borders, AAA text, a yellow focus halo.',
		face: 'Nunito Sans'
	},
	noir: {
		sector: 'Luxury and retail',
		summary: 'Monochrome ink, square fields, pill actions, generous space, and slow motion.',
		face: 'Source Sans 3'
	},
	press: {
		sector: 'Editorial and media',
		summary: 'Printed. Source Serif 4, square corners, 2px rules, hard offset shadows, red links.',
		face: 'Source Serif 4'
	}
};

export const brands: Brand[] = [
	{ id: 'ambre', name: 'Ambre', ...details.ambre },
	...presetList.map((preset: { id: string; name: string }) => ({
		id: preset.id,
		name: preset.name,
		...(details[preset.id] ?? { sector: 'Preset', summary: '', face: '' })
	}))
];

/**
 * Attributes that scope a live example to a brand and theme. Ambre needs no data-brand.
 * With no theme yet (before hydration) an Ambre example sets nothing and inherits the page's theme,
 * so a dark page never flashes a light example.
 */
export function scope(brand: string, theme: string | null) {
	if (!theme) return brand === 'ambre' ? {} : { 'data-brand': brand, 'data-theme': 'light' };
	return brand === 'ambre' ? { 'data-theme': theme } : { 'data-brand': brand, 'data-theme': theme };
}
