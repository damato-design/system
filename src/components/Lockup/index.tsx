import { createElement, cloneElement, forwardRef, FC } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { TextProps } from '../Text';
import { icon } from '../Icon';

export type LockupProps = BoxProps & {
  /**
   * A string reference to an `<icon/>` element.
   */
  icon?: string,
  title?: FC<TextProps>,
};

export const lockup = proxy<HTMLTagsOnly, LockupProps>('lockup', (TagName) => {
  return forwardRef<HTMLElement, LockupProps>(({
    icon: iconRef,
    children,
    title,
    className,
    style,
    ...props
  }: LockupProps, ref) => {

    const Element = box[TagName];
    let iconElement = iconRef ? createElement(icon[iconRef]) : null;
    if (title && iconElement) {
      const titleStyle = {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center'
      };
      iconElement = cloneElement(title, {
        "aria-hidden": true,
        style: titleStyle,
      }, iconElement);
    }

    // TODO: optional onClose button, use bouyant approach

    return <Element
      { ...props }
      ref={ ref }
      inset={{ block: 'start' }}
      gap>
        {iconElement}
        <box.div stack gap inset={{ block: 'start' }}>
          { title }
          { children }
        </box.div>
      </Element>;
  })
});
