import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

// A decorative placeholder image, drawn with the brand's own accent, so no asset is needed.
const media = html`<div
  slot="media"
  style="aspect-ratio: 16 / 9; background: linear-gradient(135deg, color-mix(in oklab, var(--amb-color-accent-bg) 70%, var(--amb-color-bg-surface)), var(--amb-color-accent-bg-active));"
></div>`;

const meta = {
  title: 'Content/Card',
  component: 'amb-card',
  args: {
    variant: 'raised',
    href: '',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['raised', 'outlined', 'filled'] },
    href: { control: 'text' },
  },
  render: ({ variant, href }) => html`
    <div style="max-width: 22rem;">
      <amb-card variant=${variant} href=${href}>
        <h3 slot="heading">Autumn linen collection</h3>
        <p>Washed linen in six colors, woven in Portugal. Free returns for 30 days.</p>
        <amb-button slot="footer" size="sm" variant="secondary">Save for later</amb-button>
      </amb-card>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Raised: Story = {};
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Filled: Story = { args: { variant: 'filled' } };
export const Link: Story = { args: { href: '#autumn-linen' } };
export const WithMedia: Story = {
  args: { href: '#autumn-linen' },
  render: ({ variant, href }) => html`
    <ul style="display:grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: var(--amb-space-400); margin:0; padding:0; list-style:none;">
      ${['Autumn linen', 'Stoneware', 'Wool throws'].map(
        (title) => html`<li>
          <amb-card variant=${variant} href=${href}>
            ${media}
            <h3 slot="heading">${title}</h3>
            <p>New this week. Made in small batches.</p>
            <amb-badge slot="footer" variant="accent">New</amb-badge>
          </amb-card>
        </li>`,
      )}
    </ul>
  `,
};
