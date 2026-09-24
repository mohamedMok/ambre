import type { StorybookConfig } from '@storybook/web-components-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // GitHub-flavoured Markdown, for the tables in the guides.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') config.base = '/storybook/';
    return config;
  },
};

export default config;
