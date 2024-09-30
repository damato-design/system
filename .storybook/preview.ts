import type { Preview } from "@storybook/react";
import theme from './theme';

const preview: Preview = {
  parameters: {
    viewMode: 'docs',
    toolbar: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
      theme,
      canvas: {
        sourceState: 'shown'
      },
      source: {
        excludeDecorators: true,
      }
    }
  },

  tags: ["autodocs"]
};

export default preview;
