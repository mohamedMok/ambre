import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Forms/Date picker',
  component: 'amb-date-picker',
  args: {
    label: 'Delivery date',
    name: 'delivery',
    value: '',
    min: '',
    max: '',
    disabled: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text', description: 'YYYY-MM-DD' },
    min: { control: 'text', description: 'YYYY-MM-DD' },
    max: { control: 'text', description: 'YYYY-MM-DD' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: ({ label, name, value, min, max, disabled, required }) => html`
    <div style="max-width: 20rem; min-height: 26rem;">
      <amb-date-picker
        name=${name}
        .value=${value}
        min=${min}
        max=${max}
        ?disabled=${disabled}
        ?required=${required}
      >${label}</amb-date-picker>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Empty: Story = {};
export const WithValue: Story = { args: { value: '2026-10-14' } };
export const WithBounds: Story = {
  args: { label: 'Check-in', value: '2026-10-14', min: '2026-10-05', max: '2026-10-28' },
};
export const Required: Story = { args: { required: true } };
export const Disabled: Story = { args: { value: '2026-10-14', disabled: true } };
