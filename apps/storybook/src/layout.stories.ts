import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const links = (items: string[]) => html`
  <ul style="display:grid; gap: 2px; margin:0; padding:0; list-style:none;">
    ${items.map(
      (item, index) => html`<li>
        <a
          href="#layout"
          aria-current=${index === 0 ? 'page' : 'false'}
          style="display:block; padding: var(--amb-space-200) var(--amb-space-300); border-radius: var(--amb-radius-md); color: inherit; text-decoration: none; ${index === 0
            ? 'background: color-mix(in oklab, var(--amb-color-accent-fg) 12%, var(--amb-color-bg-surface)); color: var(--amb-color-accent-fg); font-weight: var(--amb-font-weight-semibold);'
            : ''}"
          >${item}</a
        >
      </li>`,
    )}
  </ul>
`;

const header = html`<div slot="header" style="display:flex; align-items:center; gap: var(--amb-space-300); width:100%;">
  <strong>Northwind</strong>
  <span style="flex:1"></span>
  <amb-button size="sm" variant="secondary">Invite</amb-button>
</div>`;

const meta = {
  title: 'Layout/Layout',
  component: 'amb-layout',
  args: {
    variant: 'sidebar',
    label: 'Primary',
    aside: true,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['sidebar', 'split', 'stacked'] },
    label: { control: 'text' },
    aside: { control: 'boolean', description: 'Fill the aside slot (story only)' },
  },
  parameters: { layout: 'fullscreen' },
  render: ({ variant, label, aside }) => html`
    <amb-layout variant=${variant} label=${label} style="min-height: 36rem;">
      ${header}
      <div slot="nav">${links(['Overview', 'Projects', 'Members', 'Billing', 'Settings'])}</div>
      <h1 style="margin: 0 0 var(--amb-space-300); font-size: var(--amb-font-size-600);">Overview</h1>
      <p style="margin:0; color: var(--amb-color-fg-muted);">Everything the workspace did this week.</p>
      ${aside
        ? html`<div slot="aside">
            <strong style="display:block; margin-bottom: var(--amb-space-200); color: var(--amb-color-fg-default);">Activity</strong>
            Ada invited two people.
          </div>`
        : ''}
      <div slot="footer">© 2026 Northwind · Privacy · Terms</div>
    </amb-layout>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Sidebar: Story = {};
export const Split: Story = {
  args: { variant: 'split', label: 'Conversations', aside: false },
  render: ({ variant, label, aside }) => html`
    <amb-layout variant=${variant} label=${label} style="min-height: 36rem;">
      ${header}
      <div slot="nav">${links(['Invoice 2026-114', 'Invoice 2026-113', 'Invoice 2026-112', 'Invoice 2026-111'])}</div>
      <h1 style="margin: 0 0 var(--amb-space-300); font-size: var(--amb-font-size-600);">Invoice 2026-114</h1>
      <p style="margin:0; color: var(--amb-color-fg-muted);">Issued on 24 September. Due in 30 days.</p>
      ${aside ? html`<div slot="aside">Paid by card.</div>` : ''}
    </amb-layout>
  `,
};
export const Stacked: Story = {
  args: { variant: 'stacked', aside: false },
  render: ({ variant, label }) => html`
    <amb-layout variant=${variant} label=${label} style="min-height: 36rem;">
      ${header}
      <div slot="nav" style="display:flex; gap: var(--amb-space-400);">
        <a href="#layout" style="color: var(--amb-color-accent-fg); font-weight: var(--amb-font-weight-semibold);">Guides</a>
        <a href="#layout" style="color: inherit;">Changelog</a>
        <a href="#layout" style="color: inherit;">Pricing</a>
      </div>
      <h1 style="margin: 0 0 var(--amb-space-300); font-size: var(--amb-font-size-700);">Ship the first brand</h1>
      <p style="margin:0; color: var(--amb-color-fg-muted);">A preset is one file. Load it, and every component follows.</p>
      <div slot="footer">© 2026 Northwind</div>
    </amb-layout>
  `,
};
