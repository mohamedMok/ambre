/** Workshop. The production build is copied into the docs site. Local dev stays on port 6006. */
export const storybookUrl = import.meta.env.DEV ? 'http://127.0.0.1:6006/' : '/storybook/';

/** Public origin, for absolute links in social cards. */
export const siteUrl = 'https://mohamedmok-ambre.surge.sh';

/** Source repository. */
export const repoUrl = 'https://github.com/mohamedMok/ambre';
