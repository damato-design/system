import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../docs/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],

  core: {
    disableTelemetry: true,
  },

  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        fsCache: false
      }
    },
  },

  docs: {
    docsMode: true
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    }
  },

  managerHead: (head) => {
    if (process.env.NODE_ENV === 'development') return head;
    return `${head}
    <link rel="prefetch" as="image" href="https://analytics.damato.design/api/track?domain=system.damato.design" />`;
  },

  staticDirs: ['./public'],
};
export default config;
