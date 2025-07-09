import { HTMLInputTypeAttribute, forwardRef } from 'react';
import { Globals } from 'csstype';
import css from './styles.module.scss';
import { proxy } from '../Element/proxy';
import { element, ElementProps } from '../Element';
import { useListbox } from '../Listbox';
import { useLockup } from '../Lockup';

export type InputProps = (
  | Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'>
  | Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder'>
) & ElementProps & {
  name: string;
  fieldSizing?: 'content' | 'flex';
  redact?: Boolean;
};

// React.CSSProperties does not include fieldSizing
interface ModernCSSProperties extends React.CSSProperties {
  fieldSizing?: 'content' | 'fixed' | Globals;
}

/**
 * Updates the input type based on conditions.
 * 
 * @param {String} type - Input type
 * @param {InputProps} props - Configuration object 
 * @returns {String} - New type of input
 */
function updateType(type: string, { redact }: InputProps) {
  if (type === 'password') {
    return typeof redact === 'boolean' && !redact ? 'text' : type;
  } else if (type !== 'textarea') {
    return type;
  } else {
    return null;
  }
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
    redact,
    className,
    style,
    ...props
  }: InputProps, ref) => {
    const type = updateType(inputType, { redact } as InputProps);
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
