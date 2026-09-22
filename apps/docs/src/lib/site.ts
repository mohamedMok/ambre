/** Workshop. The production build is copied into the docs site. Local dev stays on port 6006. */
export const storybookUrl = import.meta.env.DEV ? 'http://127.0.0.1:6006/' : '/storybook/';
