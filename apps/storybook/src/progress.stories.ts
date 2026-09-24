import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Feedback/Progress',
  component: 'amb-progress',
  args: { value: 64, max: 100, label: 'Upload' },
  argTypes: { value: { control: 'number' }, max: { control: 'number' }, label: { control: 'text' } },
  render: ({ value, max, label }) => html`<amb-progress value=${value} max=${max} label=${label}></amb-progress>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Partial: Story = {};
export const Empty: Story = { args: { value: 0 } };
export const Complete: Story = { args: { value: 100 } };
