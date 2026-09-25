import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Forms/Radio card',
  component: 'amb-radio-card',
  args: {
    name: 'plan',
    checked: true,
    disabled: false,
    required: false,
  },
  argTypes: {
    name: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: ({ name, checked, disabled, required }) => html`
    <fieldset style="display:grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--amb-space-300); margin:0; padding:0; border:0;">
      <legend style="margin-bottom: var(--amb-space-300); font-weight: var(--amb-font-weight-semibold);">Plan</legend>
      <amb-radio-card name=${name} value="starter" ?required=${required}>
        Starter
        <span slot="description">Up to 3 people. Free.</span>
      </amb-radio-card>
      <amb-radio-card name=${name} value="team" ?checked=${checked} ?required=${required}>
        Team
        <span slot="description">Up to 50 people. 8 euros a person a month.</span>
      </amb-radio-card>
      <amb-radio-card name=${name} value="business" ?disabled=${disabled} ?required=${required}>
        Business
        <span slot="description">Unlimited people, single sign-on, and an audit log.</span>
      </amb-radio-card>
    </fieldset>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Group: Story = {};
export const NoSelection: Story = { args: { checked: false } };
export const Disabled: Story = { args: { disabled: true } };
export const WithIcons: Story = {
  render: ({ name }) => html`
    <fieldset style="display:grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--amb-space-300); margin:0; padding:0; border:0;">
      <legend style="margin-bottom: var(--amb-space-300); font-weight: var(--amb-font-weight-semibold);">Delivery</legend>
      <amb-radio-card name=${`${name}-delivery`} value="standard" checked>
        <amb-icon slot="icon" name="local_shipping"></amb-icon>
        Standard
        <span slot="description">3 to 5 days, free.</span>
      </amb-radio-card>
      <amb-radio-card name=${`${name}-delivery`} value="express">
        <amb-icon slot="icon" name="bolt"></amb-icon>
        Express
        <span slot="description">Next day, 9 euros.</span>
      </amb-radio-card>
      <amb-radio-card name=${`${name}-delivery`} value="pickup">
        <amb-icon slot="icon" name="storefront"></amb-icon>
        Pick up in store
        <span slot="description">Today, free.</span>
      </amb-radio-card>
    </fieldset>
  `,
};
