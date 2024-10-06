import React from 'react';
import type { Preview } from "@storybook/react";
import { Title, Description, Primary, Controls, Stories, useOf } from '@storybook/addon-docs';
import theme from './theme';

import './preview.css';

const page = (context) => {
  // TODO: Generate installation examples
  const of = useOf(context);
  console.log(of);
  return (
    (
      <>
        <Title/>
        <Description/>
        <Primary/>
        <Controls/>
        <Stories/>
      </>
    )
  )
};

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
      page,
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
