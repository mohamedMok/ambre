import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Forms/Checkbox',
  component: 'amb-checkbox',
  args: {
    label: 'Send product updates',
    name: 'updates',
    value: 'on',
    checked: false,
    disabled: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: ({ label, name, value, checked, disabled, required }) => html`
    <amb-checkbox name=${name} value=${value} ?checked=${checked} ?disabled=${disabled} ?required=${required}>
      ${label}
    </amb-checkbox>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true, label: 'Saved to this device' } };
export const Required: Story = { args: { required: true, label: 'I agree to the terms' } };
