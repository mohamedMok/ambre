import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Basics/Button',
  component: 'amb-button',
  args: {
    label: 'Save changes',
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  render: ({ label, variant, size, disabled, type }) => html`
    <amb-button variant=${variant} size=${size} type=${type} ?disabled=${disabled}>${label}</amb-button>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', label: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', label: 'Learn more' } };
export const Disabled: Story = { args: { disabled: true, label: 'Unavailable' } };
export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--amb-space-300); align-items:center;">
      <amb-button size="sm">Small</amb-button>
      <amb-button size="md">Medium</amb-button>
      <amb-button size="lg">Large</amb-button>
    </div>
  `,
};
