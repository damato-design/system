import type { StorybookConfig } from "@storybook/react-vite";
import { modeManager } from  './mode-manager.js';

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

  previewHead: (head) => {

    const request = {
      modes: ['base', 'callout', 'system:critical'],
      sizes: 3,
      // This should probably be optional
      // It should otherwise read from data found within the page
      // brand: 'homedepot',
    };

    return `${head}
      ${modeManager(request)}`;
  },

  managerHead: (head) => {
    if (process.env.NODE_ENV === 'development') return head;
    return `${head}
    <script async defer src="https://scripts.withcabin.com/hello.js"></script>`;
  },
};

export default config;
