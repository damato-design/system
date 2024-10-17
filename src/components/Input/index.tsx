import { HTMLInputTypeAttribute, forwardRef } from 'react';
import css from './styles.module.css';
import { proxy } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type InputElementProps = React.InputHTMLAttributes<HTMLInputElement>;

type TextareaElementProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type ElementProps = InputElementProps | TextareaElementProps & ElementComponentProps;

export const input = proxy<HTMLInputTypeAttribute | 'textarea', ElementProps>('input', (inputType) => {
  return forwardRef((props: ElementProps, ref) => {
    const config = Object.assign({
      type: inputType !== 'textarea' ? inputType : null
    }, props);
    const Element = inputType === 'textarea' ? element.textarea : element.input;
    return <Element
      { ...config }
      ref={ ref }
      className={ css.input }/>;
  })
});
