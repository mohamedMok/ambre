import type { Preview } from '@storybook/web-components-vite';
import '@ambre/tokens/css';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';

const preview: Preview = {
  globalTypes: {
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
  },
};

export default preview;
