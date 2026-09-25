import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';
import '@ambre-ds/ai';

const meta = {
  title: 'AI/Suggestion',
  component: 'amb-suggestion',
  args: {
    label: 'Summarise this week',
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  render: ({ label, disabled }) => html`<amb-suggestion ?disabled=${disabled}>${label}</amb-suggestion>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const WithIcon: Story = {
  render: ({ label }) => html`
    <amb-suggestion><amb-icon slot="icon" name="mail" size="sm"></amb-icon>${label}</amb-suggestion>
  `,
};
export const List: Story = {
  render: () => html`
    <section aria-labelledby="try" style="display:grid; gap: var(--amb-space-200);">
      <h2 id="try" style="margin:0; font-size: var(--amb-font-size-200); color: var(--amb-color-fg-muted);">Try asking</h2>
      <ul style="display:flex; flex-wrap:wrap; gap: var(--amb-space-200); margin:0; padding:0; list-style:none;">
        <li><amb-suggestion>Which invoices are overdue?</amb-suggestion></li>
        <li><amb-suggestion>Draft a payment reminder</amb-suggestion></li>
        <li><amb-suggestion>Compare this month with August</amb-suggestion></li>
      </ul>
    </section>
  `,
};
