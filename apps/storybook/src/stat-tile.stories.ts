import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Content/Stat tile',
  component: 'amb-stat-tile',
  args: {
    trend: 'up',
    sentiment: 'positive',
  },
  argTypes: {
    trend: { control: 'inline-radio', options: ['none', 'up', 'down'] },
    sentiment: { control: 'inline-radio', options: ['neutral', 'positive', 'negative'] },
  },
  render: ({ trend, sentiment }) => html`
    <div style="max-width: 18rem;">
      <amb-stat-tile trend=${trend} sentiment=${sentiment}>
        Monthly revenue
        <span slot="value">48,210 €</span>
        <span slot="delta">12% more than August</span>
        <span slot="description">September 2026</span>
      </amb-stat-tile>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Positive: Story = {};
export const Negative: Story = { args: { trend: 'down', sentiment: 'negative' } };
export const Neutral: Story = { args: { trend: 'none', sentiment: 'neutral' } };
export const Row: Story = {
  render: () => html`
    <ul style="display:grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: var(--amb-space-300); margin:0; padding:0; list-style:none;">
      <li>
        <amb-stat-tile trend="up" sentiment="positive">
          Revenue <span slot="value">48,210 €</span> <span slot="delta">12% up</span>
        </amb-stat-tile>
      </li>
      <li>
        <amb-stat-tile trend="up" sentiment="negative">
          Refunds <span slot="value">1,904 €</span> <span slot="delta">4% up</span>
        </amb-stat-tile>
      </li>
      <li>
        <amb-stat-tile trend="down" sentiment="positive">
          Support wait <span slot="value">3 min</span> <span slot="delta">40 seconds faster</span>
        </amb-stat-tile>
      </li>
      <li>
        <amb-stat-tile>Orders <span slot="value">1,284</span> <span slot="description">This month</span></amb-stat-tile>
      </li>
    </ul>
  `,
};
