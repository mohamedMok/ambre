import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@ambre-ds/ai';

const sample = `
  import '@ambre-ds/ui';

  const checkbox = document.querySelector('amb-checkbox');
  checkbox.addEventListener('change', (event) => {
    console.log(event.detail.checked);
  });
`;

const meta = {
  title: 'AI/Code block',
  component: 'amb-code-block',
  args: {
    language: 'js',
    wrap: false,
  },
  argTypes: {
    language: { control: 'text' },
    wrap: { control: 'boolean' },
  },
  render: ({ language, wrap }) => html`
    <div style="max-width: 40rem;">
      <amb-code-block language=${language} ?wrap=${wrap}>${sample}</amb-code-block>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const JavaScript: Story = {};
export const Shell: Story = {
  args: { language: 'bash' },
  render: ({ language }) => html`
    <div style="max-width: 40rem;">
      <amb-code-block language=${language}>npm install @ambre-ds/tokens @ambre-ds/ui @ambre-ds/ai</amb-code-block>
    </div>
  `,
};
export const Wrapped: Story = {
  args: { language: '', wrap: true },
  render: ({ language, wrap }) => html`
    <div style="max-width: 24rem;">
      <amb-code-block language=${language} ?wrap=${wrap}>A very long line that would scroll sideways, wrapped instead because wrap is set on the element.</amb-code-block>
    </div>
  `,
};
