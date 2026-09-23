import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Forms/Text area',
  component: 'amb-text-area',
  args: { label: 'Note', name: 'note', value: '', placeholder: 'What changed?', rows: 4, disabled: false, required: false, readonly: false },
  argTypes: {
    label: { control: 'text' },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
  render: ({ label, name, value, placeholder, rows, disabled, required, readonly }) => html`
    <amb-text-area name=${name} value=${value} placeholder=${placeholder} rows=${rows} ?disabled=${disabled} ?required=${required} ?readonly=${readonly}>${label}</amb-text-area>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Empty: Story = {};
export const Filled: Story = { args: { value: 'The brand is one preset.' } };
export const Disabled: Story = { args: { disabled: true, value: 'Unavailable' } };
export const Required: Story = { args: { required: true } };
