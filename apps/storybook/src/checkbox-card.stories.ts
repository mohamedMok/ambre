import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Forms/Checkbox card',
  component: 'amb-checkbox-card',
  args: {
    checked: false,
    disabled: false,
    required: false,
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  render: ({ checked, disabled, required }) => html`
    <fieldset style="display:grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: var(--amb-space-300); margin:0; padding:0; border:0;">
      <legend style="margin-bottom: var(--amb-space-300); font-weight: var(--amb-font-weight-semibold);">Add-ons</legend>
      <amb-checkbox-card name="addons" value="backup" ?checked=${checked} ?required=${required}>
        <amb-icon slot="icon" name="backup"></amb-icon>
        Daily backups
        <span slot="description">Keep 30 days of snapshots. 4 euros a month.</span>
      </amb-checkbox-card>
      <amb-checkbox-card name="addons" value="support">
        <amb-icon slot="icon" name="support_agent"></amb-icon>
        Priority support
        <span slot="description">An answer within four hours, every day.</span>
      </amb-checkbox-card>
      <amb-checkbox-card name="addons" value="sso" ?disabled=${disabled}>
        <amb-icon slot="icon" name="key"></amb-icon>
        Single sign-on
        <span slot="description">Only on the Business plan.</span>
      </amb-checkbox-card>
    </fieldset>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Group: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Required: Story = { args: { required: true } };
