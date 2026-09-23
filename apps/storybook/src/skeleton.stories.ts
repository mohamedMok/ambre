import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Feedback/Skeleton',
  component: 'amb-skeleton',
  render: () => html`
    <div style="display:grid; gap: var(--amb-space-300); width: 20rem;">
      <amb-skeleton></amb-skeleton>
      <amb-skeleton></amb-skeleton>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Bars: Story = {};
