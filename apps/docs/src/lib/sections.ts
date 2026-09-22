export type DocLink = {
	href: string;
	label: string;
	summary: string;
};

export const header = [
	{ href: '/get-started', label: 'Install' },
	{ href: '/foundations', label: 'Foundations' },
	{ href: '/components', label: 'Components' }
];

export const foundations: DocLink[] = [
	{
		href: '/foundations/color',
		label: 'Color',
		summary: 'Override the theme. Leave the palette alone.'
	},
	{
		href: '/foundations/typography',
		label: 'Type',
		summary: 'Source Sans 3 for the interface. Source Code Pro for the names.'
	},
	{
		href: '/foundations/space',
		label: 'Space',
		summary: 'One scale for rhythm, radius, and the height of a control.'
	}
];

export const componentGroups: { title: string; summary: string; items: DocLink[] }[] = [
	{
		title: 'Basics',
		summary: 'Act, go somewhere, reveal a region, or show a graphic.',
		items: [
			{
				href: '/components/button',
				label: 'Button',
				summary: 'An action. A link is for going somewhere.'
			},
			{
				href: '/components/link',
				label: 'Link',
				summary: 'A destination. The text in the slot is the name.'
			},
			{
				href: '/components/disclosure',
				label: 'Disclosure',
				summary: 'Show a region. Hide it again.'
			},
			{
				href: '/components/icon',
				label: 'Icon',
				summary: 'A sized graphic. Name it only when it carries meaning.'
			}
		]
	},
	{
		title: 'Forms',
		summary: 'Collect a value or a choice.',
		items: [
			{
				href: '/components/text-field',
				label: 'Text field',
				summary: 'One line. The label is the name, and the value joins the form.'
			},
			{
				href: '/components/checkbox',
				label: 'Checkbox',
				summary: 'A choice that can stand alone.'
			},
			{
				href: '/components/radio',
				label: 'Radio',
				summary: 'One choice in a named group.'
			},
			{
				href: '/components/select',
				label: 'Select',
				summary: 'One option from a list.'
			}
		]
	}
];

export const components = componentGroups.flatMap((group) => group.items);

export function inSection(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}
