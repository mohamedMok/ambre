import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';
import '@ambre-ds/ai';

const meta = {
  title: 'AI/Prompt',
  component: 'amb-prompt',
  args: {
    label: 'Message',
    placeholder: 'Ask about your invoices',
    value: '',
    disabled: false,
    busy: false,
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    busy: { control: 'boolean' },
  },
  render: ({ label, placeholder, value, disabled, busy }) => html`
    <div style="max-width: 40rem;">
      <amb-prompt placeholder=${placeholder} .value=${value} ?disabled=${disabled} ?busy=${busy}>${label}</amb-prompt>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Empty: Story = {};
export const WithText: Story = { args: { value: 'Which invoices are overdue?' } };
export const Busy: Story = { args: { busy: true } };
export const Disabled: Story = { args: { disabled: true } };
export const WithActions: Story = {
  render: ({ label, placeholder }) => html`
    <div style="max-width: 40rem;">
      <amb-prompt placeholder=${placeholder}>
        ${label}
        <amb-button slot="actions" size="sm" variant="ghost">Attach</amb-button>
      </amb-prompt>
    </div>
  `,
};
