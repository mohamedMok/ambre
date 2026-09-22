import type { Meta, StoryObj } from '@storybook/web-components-vite';
import tokens from '@ambre/tokens/json';
import { html } from 'lit';

const meta = {
  title: 'Foundations/Color',
  render: () => {
    const colors = tokens.system.filter((token) => token.type === 'color' && token.css);
    return html`
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;">
        ${colors.map(
          (token) => html`
            <div style="border: 1px solid var(--amb-color-border-default); border-radius: var(--amb-radius-md); overflow: hidden;">
              <div style="height: 48px; background: var(${token.css});"></div>
              <div style="padding: 8px 12px; font: 14px/1.4 var(--amb-font-family-mono);">
                ${token.css}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Semantic: Story = {};
