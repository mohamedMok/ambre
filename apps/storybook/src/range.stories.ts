import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Forms/Range',
  component: 'amb-range',
  args: { label: 'Volume', name: 'volume', value: 40, min: 0, max: 100, step: 1, disabled: false },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  render: ({ label, name, value, min, max, step, disabled }) => html`
    <div style="width: 20rem;">
      <amb-range name=${name} value=${value} min=${min} max=${max} step=${step} ?disabled=${disabled}>${label}</amb-range>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Mid: Story = {};
export const Start: Story = { args: { value: 0 } };
export const Disabled: Story = { args: { disabled: true } };
