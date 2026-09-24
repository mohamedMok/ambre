import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Feedback/Badge',
  component: 'amb-badge',
  args: { label: 'Draft', variant: 'neutral' },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['neutral', 'accent', 'success', 'danger'] },
  },
  render: ({ label, variant }) => html`<amb-badge variant=${variant}>${label}</amb-badge>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Neutral: Story = {};
export const Accent: Story = { args: { variant: 'accent', label: 'New' } };
export const Success: Story = { args: { variant: 'success', label: 'Saved' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Failed' } };
