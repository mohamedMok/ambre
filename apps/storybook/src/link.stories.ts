import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre/ui';

const meta = {
  title: 'Basics/Link',
  component: 'amb-link',
  args: {
    label: 'Account',
    href: '/account',
    variant: 'text',
    external: false,
  },
  argTypes: {
    label: { control: 'text' },
    href: { control: 'text' },
    variant: { control: 'select', options: ['text', 'quiet'] },
    external: { control: 'boolean' },
  },
  render: ({ label, href, variant, external }) => html`
    <amb-link href=${href} variant=${variant} ?external=${external}>${label}</amb-link>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Text: Story = {};
export const Quiet: Story = { args: { variant: 'quiet', label: 'Learn more' } };
export const External: Story = {
  args: { external: true, href: 'https://github.com/mohamedMok/ambre', label: 'Repository' },
};
