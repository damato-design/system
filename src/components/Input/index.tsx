import React from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { proxy } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

export const input = proxy('input', (inputType) => {
  return (props: ElementComponentProps) => {
    const Element = inputType === 'textarea' ? element.textarea : element.input;
    return React.createElement(Element, { type: inputType, ...props});
  }
});
