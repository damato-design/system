import type { Preview } from "@storybook/react";
import theme from './theme';

const preview: Preview = {
  parameters: {
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
      }
    }
  },

  tags: ["autodocs"]
};

export default preview;
