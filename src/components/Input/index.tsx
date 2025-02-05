import { HTMLInputTypeAttribute, forwardRef } from 'react';
import { Globals } from 'csstype';
import css from './styles.module.scss';
import { proxy } from '../Element/proxy';
import { element, ElementProps } from '../Element';
import { useListbox } from '../Listbox';
import { useLockup } from '../Lockup';

export type InputProps = (React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  & ElementProps
  & {
    name: string,
    fieldSizing?: 'content' | 'flex'
  };

// React.CSSProperties does not include fieldSizing
interface ModernCSSProperties extends React.CSSProperties {
  fieldSizing?: 'content' | 'fixed' | Globals;
}

/**
 * Creates a `<input.type/>` component
 * 
 * @param {InputProps} props - Component configuration object
 * @returns {ReactElement} - A input component
 */
export const input = proxy<HTMLInputTypeAttribute | 'textarea', InputProps>('input', (inputType) => {
  return forwardRef<HTMLElement, InputProps>(({
    fieldSizing,
    className,
    style,
    ...props
  }: InputProps, ref) => {
    const type = inputType !== 'textarea' ? inputType : null;
    const { anchor: listboxProps } = useListbox();
    const { input: lockupProps } = useLockup();

    const Element = inputType === 'textarea'
      ? element.textarea
      : element.input;

    const styles: ModernCSSProperties = {};
    if (fieldSizing === 'content') {
      styles.fieldSizing = 'content';
    }

    return <Element
      {...Object.assign({ type }, props)}
      { ...listboxProps }
      { ...lockupProps }
      ref={ref}
      className={css.input}
      style={styles} />;
  })
});
