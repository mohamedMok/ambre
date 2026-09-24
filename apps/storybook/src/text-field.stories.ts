import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Forms/Text field',
  component: 'amb-text-field',
  args: {
    label: 'Email',
    name: 'email',
    value: '',
    type: 'text',
    placeholder: '',
    autocomplete: '',
    disabled: false,
    required: false,
    readonly: false,
  },
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url'] },
    placeholder: { control: 'text' },
    autocomplete: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
  render: ({ label, name, value, type, placeholder, autocomplete, disabled, required, readonly }) => html`
    <div style="max-width: 24rem;">
      <amb-text-field
        name=${name}
        .value=${value}
        type=${type}
        placeholder=${placeholder}
        autocomplete=${autocomplete}
        ?disabled=${disabled}
        ?required=${required}
        ?readonly=${readonly}
      >${label}</amb-text-field>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Text: Story = {};
export const Email: Story = {
  args: { type: 'email', autocomplete: 'email', placeholder: 'ada@example.com' },
};
export const Password: Story = {
  args: { label: 'Password', name: 'password', type: 'password', autocomplete: 'current-password' },
};
export const Search: Story = { args: { label: 'Search', name: 'q', type: 'search' } };
export const Telephone: Story = { args: { label: 'Telephone', name: 'tel', type: 'tel', autocomplete: 'tel' } };
export const Url: Story = { args: { label: 'Website', name: 'url', type: 'url', placeholder: 'https://' } };
export const Disabled: Story = { args: { disabled: true, label: 'Unavailable' } };
export const ReadOnly: Story = { args: { readonly: true, label: 'Reference', value: 'AMB-204' } };
export const Required: Story = { args: { required: true } };
