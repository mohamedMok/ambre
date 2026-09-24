import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ui';

const meta = {
  title: 'Feedback/Spinner',
  component: 'amb-spinner',
  args: { label: 'Loading articles' },
  argTypes: { label: { control: 'text' } },
  render: ({ label }) => html`<amb-spinner label=${label}></amb-spinner>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Loading: Story = {};
