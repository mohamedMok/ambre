import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Feedback/Tooltip',
  component: 'amb-tooltip',
  args: { text: 'Saves the draft on this page', label: 'Save' },
  argTypes: { text: { control: 'text' }, label: { control: 'text' } },
  render: ({ text, label }) => html`
    <amb-tooltip text=${text}><button type="button">${label}</button></amb-tooltip>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const OnAButton: Story = {};
