import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../docs/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  staticDirs: ['./public', '../src/assets'],

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
    <script async defer src="https://scripts.withcabin.com/hello.js"></script>`;
  },
};

export default config;
