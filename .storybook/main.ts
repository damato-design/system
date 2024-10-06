import type { StorybookConfig } from "@storybook/react-vite";
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  stories: ["../docs/**/*.mdx", "../src/**/stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/experimental-addon-test"
  ],

  core: {
    builder: "@storybook/builder-vite",
  },

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {
    docsMode: true,
    autodocs: true,
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    }
  },

  staticDirs: ['./public'],

  viteFinal: (config) => {
    // Add the svgr plugin to the Vite configuration
    config.plugins.push(svgr());
    
    // Return the modified config
    return config;
  }
};
export default config;
