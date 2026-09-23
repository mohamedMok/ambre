import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: 'amb-breadcrumbs',
  render: () => html`
    <amb-breadcrumbs>
      <li><a href="#home">Home</a></li>
      <li><a href="#components">Components</a></li>
      <li>Breadcrumbs</li>
    </amb-breadcrumbs>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Path: Story = {};
