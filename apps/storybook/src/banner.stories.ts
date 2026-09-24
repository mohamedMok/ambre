import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Feedback/Banner',
  component: 'amb-banner',
  args: { label: 'The library is ready to install.', variant: 'neutral' },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['neutral', 'success', 'danger'] },
  },
  render: ({ label, variant }) => html`<amb-banner variant=${variant}>${label}</amb-banner>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Neutral: Story = {};
export const Success: Story = { args: { variant: 'success', label: 'Changes saved.' } };
export const Danger: Story = { args: { variant: 'danger', label: 'The save did not finish. Try again.' } };
