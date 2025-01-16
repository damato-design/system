import { forwardRef } from 'react';
import css from './styles.module.scss';
import clsx from 'clsx';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';

export type TextProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
  & ElementProps & {
  /**
   * Set the priority intended for this component.
   * This will affect the final presentation.
   */
  priority?: 'primary' | 'auxiliary';
  /**
   * Content is only meant to be found by assistive technology.
   */
  screenreaderOnly?: boolean;
  /**
   * Avoids loading presentation when set to false
   */
  standby?: boolean;
};

export const text = proxy<HTMLTagsOnly, TextProps>('text', (TagName) => {
  return forwardRef<HTMLElement, TextProps>(({
    className,
    priority,
    standby = true,
    screenreaderOnly,
    ...props
  }: TextProps, ref) => {
    const Text = element[TagName];

    const classNames = clsx(css.text, className, { 
      [css.sronly]: screenreaderOnly
    });

    return <Text
      { ...props }
      ref={ ref }
      className={ classNames }
      data-standby={ standby }
      data-priority={ priority }/>;
  })
});
