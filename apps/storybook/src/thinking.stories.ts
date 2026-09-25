import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ai';

const meta = {
  title: 'AI/Thinking',
  component: 'amb-thinking',
  args: {
    label: 'Thinking',
  },
  argTypes: {
    label: { control: 'text' },
  },
  render: ({ label }) => html`<amb-thinking label=${label}></amb-thinking>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const NamedStep: Story = { args: { label: 'Reading 3 invoices' } };
