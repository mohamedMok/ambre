import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Navigation/Pagination',
  component: 'amb-pagination',
  args: { label: 'Article pages' },
  argTypes: { label: { control: 'text' } },
  render: ({ label }) => html`
    <amb-pagination label=${label}>
      <li><a href="#prev">Previous</a></li>
      <li><a href="#1" aria-current="page">1</a></li>
      <li><a href="#2">2</a></li>
      <li><a href="#next">Next</a></li>
    </amb-pagination>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Pages: Story = {};
