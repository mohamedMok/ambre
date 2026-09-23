import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Navigation/Tabs',
  component: 'amb-tabs',
  render: () => html`
    <amb-tabs>
      <button slot="tab" type="button">Tokens</button>
      <button slot="tab" type="button">Components</button>
      <button slot="tab" type="button" disabled>Packs</button>
      <div slot="panel">A brand is one preset of the same tokens.</div>
      <div slot="panel">The markup stays still when the brand changes.</div>
      <div slot="panel">Domain packs wait for a second product.</div>
    </amb-tabs>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const ThreeTabs: Story = {};
