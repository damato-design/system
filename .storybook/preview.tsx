import React from 'react';
import type { Preview } from "@storybook/react";
import { Title, Description, Stories, useOf } from '@storybook/addon-docs';
import Github from '../docs/components/Github';
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
    <Stories/>
    <Github/>
  </>
);

const docs = {
  page,
  toc: true,
  theme,
  canvas: {
    sourceState: 'shown'
  },
  source: {
    excludeDecorators: true,
  },
  story: {
    inline: false,
    iframeHeight: 400,
  }
};

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Welcome', 'Foundations', 'Patterns', 'Primitives', 'Components']
      }
    },
    toolbar: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs
  },
  tags: ['autodocs']
};

export default preview;
