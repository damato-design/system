import React from 'react';
import type { Preview } from "@storybook/react";
import { Title, Description, Stories, useOf } from '@storybook/addon-docs';
import Github from '../docs/components/Github';
import theme from './theme';

import './preview.css';
import { cursorTo } from 'readline';

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

function Input({ value, onChange }) {
  const id = React.useId();
  const val = isNaN(value) ? 2 : value;
  const style = {
    display: 'flex',
    gap: '1em',
    fontSize: '1rem',
    alignContent: 'center',
    opacity: '.5',
    marginBlockEnd: '1em'
  }
  return (
    <div style={ style }>
      <label htmlFor={ id }>Density Level</label>
      <input
      id={ id }
      type='range'
      min={0}
      max={2}
      value={val}
      onChange={ onChange }/>
      <output htmlFor={ id }>{ val }</output>
    </div>
  )
}

function LevelChange(Story, { parameters }) {
  const [level, setLevel] = React.useState(parameters.densityLevel);
  const onChange = React.useCallback(({ target }: any) => {
    setLevel(Number(target.value))
  }, [level]);
  const style = { '--level': level } as React.CSSProperties;
  const noControl = typeof parameters.densityLevel === 'boolean' && !parameters.densityLevel;
  const input = noControl ? null : <Input value={ level } onChange={ onChange } />;

  return (
    <div style={ style }>
      { input }
      <Story/>
    </div>
  )
}

const preview: Preview = {
  decorators: [LevelChange],
  parameters: {
    options: {
      showPanel: false,
      storySort: {
        order: ['Welcome', 'Foundations', 'Patterns', 'Primitives', 'Components']
      }
    },
    toolbar: { disable: true },
    docs
  },
  tags: ['autodocs', '!dev']
};

export default preview;
