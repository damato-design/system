import { HTMLInputTypeAttribute } from 'react';
import css from './styles.module.css';
import { proxy, Props } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type ElementProps = Props<HTMLInputElement> & ElementComponentProps;

export const input = proxy<HTMLInputTypeAttribute, ElementProps>('input', (inputType) => {
  return (props: ElementProps) => {
    const Element = inputType === 'textarea' ? element.textarea : element.input;
    const type = inputType !== 'textarea' ? inputType : null;
    return <Element
      { ...props}
      className={ css.input }
      type={ type }/>;
  }
});
