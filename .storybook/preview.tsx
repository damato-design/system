import React from 'react';
import type { Preview } from "@storybook/react";
import { Title, Description, Primary, Controls, Stories, useOf, DocsContainer } from '@storybook/addon-docs';
import { Unstyled } from "@storybook/blocks";
import theme from './theme';

import './preview.css';

function capitalize(str: string, locale = navigator.language) {
  return str.replace(/^\p{CWU}/u, (char: string) => char.toLocaleUpperCase(locale));
}

function Install(props) {
  const { of } = props;
  const resolveOf = useOf(of || 'meta');
  const { kind } = resolveOf?.preparedMeta;
  if (!kind) return null;

  const [_, component] = kind.split('/');

  return (
    <pre className='docs-install'>
      <code>{ `import { ${component} } from '@components/${capitalize(component)}';`}</code>
    </pre>
  )
}

const page = () => (
  <>
    <Title/>
    <Install/>
    <Description/>
    {/* <Primary/> */}
    {/* <details>
      <summary className='controls-summary'>
        <h3>Controls</h3>
      </summary>
      <Controls/>
    </details> */}
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
      },
      container: ({ children, context }) => (
        <DocsContainer context={context}>
          <Unstyled>
              {children}
          </Unstyled>
        </DocsContainer>
      ),
    }
  },
  tags: ["autodocs"]
};

export default preview;
