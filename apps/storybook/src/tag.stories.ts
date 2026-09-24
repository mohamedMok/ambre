import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Feedback/Tag',
  component: 'amb-tag',
  args: { label: 'Design systems', variant: 'neutral' },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['neutral', 'accent'] },
  },
  render: ({ label, variant }) => html`<amb-tag variant=${variant}>${label}</amb-tag>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Neutral: Story = {};
export const Accent: Story = { args: { variant: 'accent', label: 'Featured' } };
