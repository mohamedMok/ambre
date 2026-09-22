import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Forms/Radio',
  component: 'amb-radio',
  args: {
    name: 'plan',
    checked: false,
    disabled: false,
    required: true,
  },
  argTypes: {
    name: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: ({ name, checked, disabled, required }) => html`
    <fieldset style="display:grid; gap: var(--amb-space-100); margin:0; padding:0; border:0;">
      <legend style="margin-bottom: var(--amb-space-200); font-weight: var(--amb-font-weight-semibold);">Plan</legend>
      <amb-radio name=${name} value="annual" ?checked=${checked} ?required=${required}>Annual</amb-radio>
      <amb-radio name=${name} value="monthly" ?required=${required}>Monthly</amb-radio>
      <amb-radio name=${name} value="weekly" ?disabled=${disabled}>Weekly</amb-radio>
    </fieldset>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Group: Story = {};
export const Selected: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
