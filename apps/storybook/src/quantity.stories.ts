import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/commerce';

const meta = {
  title: 'Commerce/Quantity',
  component: 'amb-quantity',
  args: { label: 'Linen sheet', name: 'linen', value: 1, min: 1, max: 8, step: 1, disabled: false },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  render: ({ label, name, value, min, max, step, disabled }) => html`
    <amb-quantity name=${name} value=${value} min=${min} max=${max} step=${step} ?disabled=${disabled}>${label}</amb-quantity>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const AtMinimum: Story = { args: { value: 1, label: 'Sample' } };
export const AtMaximum: Story = { args: { value: 8, label: 'Linen sheet' } };
export const Disabled: Story = { args: { disabled: true } };
