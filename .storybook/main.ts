import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  get stories() {
    return [
      "../docs/**/*.mdx",
      "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ]
  },

  get staticDirs() {
    return ['./public', '../src/assets']
  },

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],

  core: {
    disableTelemetry: true,
  },

  framework: "@storybook/react-vite",

  managerHead: (head) => {
    if (process.env.NODE_ENV === 'development') return head;
    return `${head}
    <link rel="prefetch" as="image" href="https://analytics.damato.design/api/track?domain=system.damato.design" />`;
  },
};

export default config;
