import type { Preview } from '@storybook/web-components-vite';
import { presetList } from '@ambre/tokens';
import '@ambre/tokens/css';
import '@ambre/tokens/css/presets';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/nunito-sans/400.css';
import '@fontsource/nunito-sans/600.css';
import '@fontsource/nunito-sans/700.css';
import '@fontsource/source-serif-4/400.css';
import '@fontsource/source-serif-4/600.css';
import '@fontsource/source-serif-4/700.css';
import '@fontsource/material-symbols-outlined/latin-400.css';
// Register every element once, so docs pages render them as well as stories.
import '@ambre/ui';
import '@ambre/commerce';

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Brand preset',
      defaultValue: 'ambre',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'ambre', title: 'Ambre' },
          ...presetList.map((preset) => ({ value: preset.id, title: preset.name })),
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const brand = context.globals.brand;
      if (!brand || brand === 'ambre') delete document.documentElement.dataset.brand;
      else document.documentElement.dataset.brand = brand;
      document.documentElement.dataset.theme = context.globals.theme ?? 'light';
      document.body.style.background = 'var(--amb-color-bg-canvas)';
      document.body.style.color = 'var(--amb-color-fg-default)';
      document.body.style.fontFamily = 'var(--amb-font-family-sans)';
      return story();
    },
  ],
  parameters: {
    backgrounds: { disable: true },
    controls: { expanded: true },
    options: {
      storySort: {
        order: ['Get started', 'Foundations', 'Basics', 'Forms', 'Feedback', 'Navigation', 'Commerce'],
      },
    },
  },
};

export default preview;
