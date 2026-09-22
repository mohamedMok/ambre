import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Forms/Select',
  component: 'amb-select',
  args: {
    label: 'Country',
    name: 'country',
    value: '',
    disabled: false,
    required: false,
  },
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'select', options: ['', 'fr', 'jp'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: ({ label, name, value, disabled, required }) => html`
    <div style="max-width: 24rem;">
      <amb-select name=${name} .value=${value} ?disabled=${disabled} ?required=${required}>
        ${label}
        <option value="">Choose a country</option>
        <option value="fr">France</option>
        <option value="jp">Japan</option>
      </amb-select>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Empty: Story = {};
export const Selected: Story = { args: { value: 'fr' } };
export const Disabled: Story = { args: { disabled: true, value: 'jp' } };
export const Required: Story = { args: { required: true } };
