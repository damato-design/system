import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  get stories() {
    if (process.env.SB_COMPS) {
      return [
        "../src/compositions/**/*.stories.@(js|jsx|mjs|ts|tsx)"
      ]
    }

    return [
      "../docs/**/*.mdx",
      "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ]
  },

  get staticDirs() {
    const dirs = ['./public', '../src/assets'];

    if (!process.env.SB_COMPS) {
      dirs.push('../_static-compositions');
    }

    return dirs;
  },
  
  get refs() {
    return undefined;
    if (process.env.SB_COMPS) return undefined;
    return {
      'compositions': {
        title: 'Compositions',
        url: 'compositions'
      }
    }
  },

  env: (config) => ({
    ...config,
    PREVIEW_DOCS: String(!process.env.SB_COMPS),
  }),

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
