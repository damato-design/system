import React from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { proxy } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

export const input = proxy('input', (TagName) => {
  return (props: ElementComponentProps) => {
    return React.createElement(element[TagName], props);
  }
});
