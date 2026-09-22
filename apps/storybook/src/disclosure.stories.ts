import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Basics/Disclosure',
  component: 'amb-disclosure',
  args: {
    label: 'Shipping',
    panel: 'Arrives in two days.',
    open: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    panel: { control: 'text' },
    open: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: ({ label, panel, open, disabled }) => html`
    <div style="max-width: 28rem;">
      <amb-disclosure ?open=${open} ?disabled=${disabled}>
        ${label}
        <p slot="panel">${panel}</p>
      </amb-disclosure>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Closed: Story = {};
export const Open: Story = { args: { open: true } };
export const Disabled: Story = { args: { disabled: true, label: 'Unavailable' } };
