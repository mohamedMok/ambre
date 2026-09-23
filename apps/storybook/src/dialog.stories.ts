import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Navigation/Dialog',
  component: 'amb-dialog',
  args: { open: false, label: 'Save the draft', close: 'Close' },
  argTypes: { open: { control: 'boolean' }, label: { control: 'text' }, close: { control: 'text' } },
  render: ({ open, label, close }) => html`
    <amb-dialog ?open=${open} label=${label}>
      <p>The draft stays on this page until you confirm.</p>
      <span slot="close">${close}</span>
    </amb-dialog>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Closed: Story = {};
export const Open: Story = { args: { open: true } };
