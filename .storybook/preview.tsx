import React from 'react';
import type { Preview } from "@storybook/react";
import { Title, Description, Stories, Markdown, useOf } from '@storybook/addon-docs';
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

function Checklist(props) {
  const { of } = props;
  const resolveOf = useOf(of || 'meta');
  const { parameters } = resolveOf?.preparedMeta;
  if (!parameters?.checklist) return null;
  return (
    <Markdown className='checklist'>{ parameters.checklist }</Markdown>
  )
}

const page = () => (
  <>
    <Title/>
    <Install/>
    <Description/>
    <Stories/>
    <Checklist/>
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
    marginBlockEnd: '1em',
    accentColor: 'currentColor'
  }
  return (
    <div style={ style } className='density-level-control'>
      <a
        href='/?path=/docs/foundations-density--docs'
        target="_top"
        style={{ color: 'currentcolor' }}>
          Density Level
      </a>
      <input
      aria-label="Density Level"
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
        method: 'alphabetical',
        order: ['Welcome', 'Foundations', 'Patterns', 'Primitives', ['Overview'], 'Components', ['Overview'], 'Compositions']
      }
    },
    toolbar: { disable: true },
    docs
  },
  tags: ['autodocs', '!dev']
};

export default preview;
