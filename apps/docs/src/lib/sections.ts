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
		summary: 'The face, the scale, and the weight. A preset replaces them.'
	},
	{
		href: '/foundations/space',
		label: 'Space',
		summary: 'Rhythm, corners, and the height of a control. A preset replaces them.'
	},
	{
		href: '/foundations/motion',
		label: 'Motion',
		summary: 'How something arrives, leaves, and repeats. A preset replaces the timing.'
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
				summary: 'A Material Symbols name, or an SVG you bring.'
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
				href: '/components/text-area',
				label: 'Text area',
				summary: 'Several lines. The label is the name.'
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
			},
			{
				href: '/components/toggle',
				label: 'Toggle',
				summary: 'On or off. The label is the name.'
			},
			{
				href: '/components/range',
				label: 'Range',
				summary: 'A number between two ends.'
			}
		]
	},
	{
		title: 'Feedback',
		summary: 'Status, progress, and a short description.',
		items: [
			{
				href: '/components/badge',
				label: 'Badge',
				summary: 'A small status. It is not a button.'
			},
			{
				href: '/components/tag',
				label: 'Tag',
				summary: 'A label for recognition. It does not navigate.'
			},
			{
				href: '/components/banner',
				label: 'Banner',
				summary: 'A page-level message with a status.'
			},
			{
				href: '/components/progress',
				label: 'Progress',
				summary: 'How much of a task is finished.'
			},
			{
				href: '/components/spinner',
				label: 'Spinner',
				summary: 'Something is loading. The label names the wait.'
			},
			{
				href: '/components/skeleton',
				label: 'Skeleton',
				summary: 'The shape of content that has not arrived.'
			},
			{
				href: '/components/tooltip',
				label: 'Tooltip',
				summary: 'A short description on hover and focus.'
			}
		]
	},
	{
		title: 'Navigation',
		summary: 'Move through a place, a list, or a conversation.',
		items: [
			{
				href: '/components/breadcrumbs',
				label: 'Breadcrumbs',
				summary: 'The path back. The last item is the current page.'
			},
			{
				href: '/components/pagination',
				label: 'Pagination',
				summary: 'Pages of a list. Mark the current one.'
			},
			{
				href: '/components/tabs',
				label: 'Tabs',
				summary: 'One panel at a time. Arrow keys move the selection.'
			},
			{
				href: '/components/menu',
				label: 'Menu',
				summary: 'A button that opens a list of actions.'
			},
			{
				href: '/components/dialog',
				label: 'Dialog',
				summary: 'A modal conversation. Escape closes it.'
			}
		]
	},
	{
		title: 'Commerce',
		summary: 'Shop compositions. They live in @ambre/commerce, outside the core library.',
		items: [
			{
				href: '/components/quantity',
				label: 'Quantity',
				summary: 'How many. Decrease and increase stay within the bounds.'
			}
		]
	}
];

export const components = componentGroups.flatMap((group) => group.items);

export function inSection(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}
