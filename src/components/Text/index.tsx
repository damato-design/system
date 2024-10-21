import { forwardRef, useEffect, useId } from 'react';
import css from './styles.module.css';
import clsx from 'clsx';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';

export type TextProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
  & ElementProps & {
  /**
   * Set the priority intended for this component.
   * This will affect the final presentation.
   */
  priority?: 'primary' | 'secondary';
  /**
   * A function that provides accessible attributes for more clarity
   * that this component is meant to provide for assistive technologies.
   */
  getScreenreaderProps?: (props: TextProps) => void;
  /**
   * If set, component is shown in a loading state.
   */
  standby?: boolean;
};

export const text = proxy<HTMLTagsOnly, TextProps>('text', (TagName) => {
  return forwardRef<HTMLElement, TextProps>(({
    priority,
    getScreenreaderProps,
    standby,
    className,
    style,
    ...props
  }: TextProps, ref) => {
    const Text = element[TagName];
    const id = useId();

    useEffect(() => {
      typeof getScreenreaderProps === 'function'
        && getScreenreaderProps({
          'aria-describedby': id
        });
    }, [getScreenreaderProps]);

    const classNames = clsx(css.text, { 
      [css.sronly]: typeof getScreenreaderProps === 'function'
    });

    return <Text
      { ...props }
      ref={ ref }
      id={ id }
      className={ classNames }
      data-priority={ priority }/>;
  })
});
