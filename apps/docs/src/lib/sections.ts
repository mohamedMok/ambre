export type DocLink = {
	href: string;
	label: string;
	summary: string;
};

export const header = [
	{ href: '/get-started', label: 'Get started' },
	{ href: '/foundations', label: 'Foundations' },
	{ href: '/components', label: 'Components' },
	{ href: '/brands', label: 'Brands' },
	{ href: '/builder', label: 'Builder' }
];

export const gettingStarted: DocLink[] = [
	{
		href: '/get-started',
		label: 'Install',
		summary: 'Build the packages, load the theme, and use the elements.'
	},
	{
		href: '/brands',
		label: 'Brands',
		summary: 'Five presets on the same tokens. A brand is one file.'
	},
	{
		href: '/builder',
		label: 'Preset builder',
		summary: 'Edit every token or roll a brand at random, preview it live, and export the preset.'
	}
];

export const foundations: DocLink[] = [
	{
		href: '/foundations/color',
		label: 'Color',
		summary: 'Semantic decisions for two themes. The palette stays in the token files.'
	},
	{
		href: '/foundations/typography',
		label: 'Typography',
		summary: 'The face, the scale, and the weight. A preset replaces them.'
	},
	{
		href: '/foundations/space',
		label: 'Space and shape',
		summary: 'Rhythm, corners, control heights, and elevation.'
	},
	{
		href: '/foundations/motion',
		label: 'Motion',
		summary: 'How something arrives, leaves, settles, and repeats.'
	},
	{
		href: '/foundations/accessibility',
		label: 'Accessibility',
		summary: 'WCAG 2.2 AA as the floor, and the contrast pairs every brand must pass.'
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
			},
			{
				href: '/components/date-picker',
				label: 'Date picker',
				summary: 'A date typed in the local format, or picked from a calendar.'
			},
			{
				href: '/components/checkbox-card',
				label: 'Checkbox card',
				summary: 'A checkbox with room to explain. The whole card toggles.'
			},
			{
				href: '/components/radio-card',
				label: 'Radio card',
				summary: 'One choice in a group, with the facts people compare.'
			}
		]
	},
	{
		title: 'Content',
		summary: 'Group a subject, open a destination, or show a figure.',
		items: [
			{
				href: '/components/card',
				label: 'Card',
				summary: 'One subject on a surface. With an href, the heading is the link.'
			},
			{
				href: '/components/tile',
				label: 'Tile',
				summary: 'A compact entry point in a grid, with an icon.'
			},
			{
				href: '/components/stat-tile',
				label: 'Stat tile',
				summary: 'A key figure, its change, and a line of context.'
			}
		]
	},
	{
		title: 'Layout',
		summary: 'The frame of a page. Three layouts, one set of landmarks.',
		items: [
			{
				href: '/components/layout',
				label: 'Layout',
				summary: 'Sidebar, split, or stacked. It answers the width it is given.'
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
		summary: 'Shop compositions. They live in @ambre-ds/commerce, outside the core library.',
		items: [
			{
				href: '/components/quantity',
				label: 'Quantity',
				summary: 'How many. Decrease and increase stay within the bounds.'
			}
		]
	},
	{
		title: 'AI',
		summary: 'Conversation compositions. They live in @ambre-ds/ai, outside the core library.',
		items: [
			{
				href: '/components/prompt',
				label: 'Prompt',
				summary: 'The composer. Enter sends, and a stop button replaces send while busy.'
			},
			{
				href: '/components/message',
				label: 'Message',
				summary: 'One turn of the conversation: complete, streaming, or failed.'
			},
			{
				href: '/components/thinking',
				label: 'Thinking',
				summary: 'The assistant is working. The label names the step.'
			},
			{
				href: '/components/suggestion',
				label: 'Suggestion',
				summary: 'A prompt people can send in one press.'
			}
		]
	}
];

export const components = componentGroups.flatMap((group) => group.items);

/** The sidebar: every documentation page, grouped. */
export const sidebar: { title: string; items: DocLink[] }[] = [
	{ title: 'Get started', items: gettingStarted },
	{ title: 'Foundations', items: foundations },
	...componentGroups.map((group) => ({ title: group.title, items: group.items }))
];

/** Everything the search palette can reach. */
export const searchable: (DocLink & { group: string })[] = [
	{ href: '/', label: 'Home', summary: 'One library. Any brand.', group: 'Ambre' },
	...sidebar.flatMap((section) => section.items.map((item) => ({ ...item, group: section.title })))
];

export function inSection(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}
