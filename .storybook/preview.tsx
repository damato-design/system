import React from 'react';
import type { Preview } from "@storybook/react";
import { Title, Description, Primary, Controls, Stories, useOf } from '@storybook/addon-docs';
import theme from './theme';

import './preview.css';

function Install(props) {
  const { of } = props;
  const resolveOf = useOf(of || 'meta');
  const { kind } = resolveOf?.preparedMeta;
  if (!kind) return null;

  const [_, component] = kind.split('/');

  return (
    <pre className='docs-install'>
      <code>{ `import { ${component} } from '@components/${component}';`}</code>
    </pre>
  )
}

const page = () => (
  <>
    <Title/>
    <Install/>
    <Description/>
    <Primary/>
    <Controls/>
    <Stories/>
  </>
);

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Welcome']
      }
    },
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
