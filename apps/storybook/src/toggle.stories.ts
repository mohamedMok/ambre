import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Forms/Toggle',
  component: 'amb-toggle',
  args: { label: 'Email alerts', name: 'alerts', checked: true, disabled: false, required: false },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: ({ label, name, checked, disabled, required }) => html`
    <amb-toggle name=${name} ?checked=${checked} ?disabled=${disabled} ?required=${required}>${label}</amb-toggle>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const On: Story = {};
export const Off: Story = { args: { checked: false, label: 'Weekly digest' } };
export const Disabled: Story = { args: { disabled: true } };
