import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Navigation/Menu',
  component: 'amb-menu',
  args: { label: 'Share', open: false, disabled: false },
  argTypes: { label: { control: 'text' }, open: { control: 'boolean' }, disabled: { control: 'boolean' } },
  render: ({ label, open, disabled }) => html`
    <amb-menu ?open=${open} ?disabled=${disabled}>
      ${label}
      <button slot="panel" type="button">Copy link</button>
      <button slot="panel" type="button">Email</button>
    </amb-menu>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Closed: Story = {};
export const Open: Story = { args: { open: true } };
export const Disabled: Story = { args: { disabled: true } };
