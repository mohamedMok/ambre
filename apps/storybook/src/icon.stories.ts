import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, svg } from 'lit';
import '@ambre/ui';

const plus = svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"></path></svg>`;

const meta = {
  title: 'Basics/Icon',
  component: 'amb-icon',
  args: {
    size: 'md',
    label: 'Add',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  render: ({ size, label }) => html`<amb-icon size=${size} label=${label}>${plus}</amb-icon>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Medium: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Decorative: Story = { args: { label: '' } };
export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--amb-space-400); align-items:center;">
      <amb-icon size="sm" label="Add">${plus}</amb-icon>
      <amb-icon size="md" label="Add">${plus}</amb-icon>
      <amb-icon size="lg" label="Add">${plus}</amb-icon>
    </div>
  `,
};
