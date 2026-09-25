import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ai';

const meta = {
  title: 'AI/Tool call',
  component: 'amb-tool-call',
  args: {
    status: 'complete',
    open: false,
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['running', 'complete', 'error'] },
    open: { control: 'boolean' },
  },
  render: ({ status, open }) => html`
    <div style="max-width: 36rem;">
      <amb-tool-call status=${status} ?open=${open}>
        Searched 214 invoices
        <span slot="meta">1.2 s</span>
        <pre slot="input">search_invoices({ status: "overdue" })</pre>
        <pre slot="output">${status === 'error' ? 'Timeout after 30 s. The billing API did not answer.' : '3 results: 2026-098, 2026-104, 2026-107'}</pre>
      </amb-tool-call>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Complete: Story = {};
export const Running: Story = { args: { status: 'running' } };
export const Failed: Story = { args: { status: 'error', open: true } };
export const Open: Story = { args: { open: true } };
export const Plain: Story = {
  render: () => html`<div style="max-width: 36rem;"><amb-tool-call>Read the style guide</amb-tool-call></div>`,
};
export const Steps: Story = {
  render: () => html`
    <ol style="display:grid; gap: var(--amb-space-200); max-width: 36rem; margin:0; padding:0; list-style:none;">
      <li><amb-tool-call>Read the billing policy</amb-tool-call></li>
      <li>
        <amb-tool-call>
          Searched 214 invoices <span slot="meta">1.2 s</span>
          <pre slot="input">search_invoices({ status: "overdue" })</pre>
          <pre slot="output">3 results</pre>
        </amb-tool-call>
      </li>
      <li><amb-tool-call status="running">Drafting 3 reminders</amb-tool-call></li>
    </ol>
  `,
};
