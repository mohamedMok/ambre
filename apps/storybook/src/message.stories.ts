import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';
import '@ambre-ds/ai';

const meta = {
  title: 'AI/Message',
  component: 'amb-message',
  args: {
    from: 'assistant',
    status: 'complete',
  },
  argTypes: {
    from: { control: 'inline-radio', options: ['user', 'assistant'] },
    status: { control: 'inline-radio', options: ['complete', 'streaming', 'error'] },
  },
  render: ({ from, status }) => html`
    <div style="max-width: 44rem;">
      <amb-message from=${from} status=${status}>
        <span slot="avatar">A</span>
        <span slot="author">${from === 'user' ? 'You' : 'Assistant'}</span>
        <p>Three invoices are overdue, for 4,210 euros in total. The oldest is 2026-098, sent to Lumen on 12 August.</p>
        <amb-button slot="actions" size="sm" variant="ghost">Copy</amb-button>
        <amb-button slot="actions" size="sm" variant="ghost">Retry</amb-button>
      </amb-message>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Assistant: Story = {};
export const User: Story = {
  args: { from: 'user' },
  render: () => html`
    <div style="max-width: 44rem;">
      <amb-message from="user">Which invoices are overdue?</amb-message>
    </div>
  `,
};
export const Streaming: Story = { args: { status: 'streaming' } };
export const Failed: Story = { args: { status: 'error' } };
export const Conversation: Story = {
  render: () => html`
    <div role="log" aria-label="Conversation" style="display:grid; gap: var(--amb-space-500); max-width: 44rem;">
      <amb-message from="user">Which invoices are overdue?</amb-message>
      <amb-message>
        <span slot="avatar">A</span>
        <span slot="author">Assistant</span>
        <p>Three, for 4,210 euros in total:</p>
        <ul>
          <li>2026-098, Lumen, 1,900 euros</li>
          <li>2026-104, Orbit, 1,450 euros</li>
          <li>2026-107, Kiln, 860 euros</li>
        </ul>
      </amb-message>
      <amb-message from="user">Draft a reminder to Lumen.</amb-message>
      <amb-thinking label="Writing the reminder"></amb-thinking>
    </div>
  `,
};
