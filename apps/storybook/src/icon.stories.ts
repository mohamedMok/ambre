import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, svg } from 'lit';
import '@ambre/ui';

const plus = svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"></path></svg>`;

const meta = {
  title: 'Basics/Icon',
  component: 'amb-icon',
  args: {
    name: 'favorite',
    size: 'md',
    label: 'Favorite',
  },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  render: ({ name, size, label }) => html`<amb-icon name=${name} size=${size} label=${label}></amb-icon>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Favorite: Story = {};
export const Search: Story = { args: { name: 'search', label: 'Search' } };
export const Settings: Story = { args: { name: 'settings', size: 'lg', label: 'Settings' } };
export const Slotted: Story = {
  args: { name: '', label: 'Add' },
  render: ({ size, label }) => html`<amb-icon size=${size} label=${label}>${plus}</amb-icon>`,
};
export const Decorative: Story = { args: { label: '' } };
export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--amb-space-400); align-items:center;">
      <amb-icon name="favorite" size="sm" label="Favorite"></amb-icon>
      <amb-icon name="favorite" size="md" label="Favorite"></amb-icon>
      <amb-icon name="favorite" size="lg" label="Favorite"></amb-icon>
    </div>
  `,
};
