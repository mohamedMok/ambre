import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Content/Tile',
  component: 'amb-tile',
  args: {
    href: '#tile',
    tone: 'neutral',
  },
  argTypes: {
    href: { control: 'text' },
    tone: { control: 'inline-radio', options: ['neutral', 'accent'] },
  },
  render: ({ href, tone }) => html`
    <ul style="display:grid; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: var(--amb-space-300); margin:0; padding:0; list-style:none;">
      <li>
        <amb-tile href=${href} tone="accent">
          <amb-icon slot="icon" name="rocket_launch"></amb-icon>
          Get started
          <span slot="description">Install the packages in five minutes.</span>
        </amb-tile>
      </li>
      <li>
        <amb-tile href=${href} tone=${tone}>
          <amb-icon slot="icon" name="group"></amb-icon>
          <amb-badge slot="meta">12</amb-badge>
          Members
          <span slot="description">Invite people and set roles.</span>
        </amb-tile>
      </li>
      <li>
        <amb-tile href=${href} tone=${tone}>
          <amb-icon slot="icon" name="receipt_long"></amb-icon>
          Billing
          <span slot="description">Plans, invoices, and tax details.</span>
        </amb-tile>
      </li>
      <li>
        <amb-tile href=${href} tone=${tone}>
          <amb-icon slot="icon" name="shield"></amb-icon>
          Security
          <span slot="description">Sign-in, keys, and the audit log.</span>
        </amb-tile>
      </li>
    </ul>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Grid: Story = {};
export const Accent: Story = { args: { tone: 'accent' } };
export const Static: Story = { args: { href: '' } };
