import { HTMLInputTypeAttribute, forwardRef } from 'react';
import { Globals } from 'csstype';
import css from './styles.module.scss';
import { proxy } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';

export type InputProps = (React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  & ElementProps
  & {
    name: string,
    fieldSizing?: 'content' | 'flex'
  };

interface ModernCSSProperties extends React.CSSProperties {
  fieldSizing?: 'content' | 'fixed' | Globals;
}

export const input = proxy<HTMLInputTypeAttribute | 'textarea', InputProps>('input', (inputType) => {
  return forwardRef<HTMLElement, InputProps>(({
    fieldSizing,
    className,
    style,
    ...props
  }: InputProps, ref) => {
    const type = inputType !== 'textarea' ? inputType : null;

    const Element = inputType === 'textarea'
      ? element.textarea
      : element.input;

    const styles: ModernCSSProperties = {};
    if (fieldSizing === 'content') {
      styles.fieldSizing = 'content';
    }

    return <Element
      {...Object.assign({ type }, restrictProps(props))}
      ref={ref}
      className={css.input}
      style={styles} />;
  })
});
