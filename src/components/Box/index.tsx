import { forwardRef } from 'react';
import clsx from 'clsx';
import css from './styles.module.scss';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';
import { alignmentStyle, AlignmentConfig } from './alignment';

interface ModernCSSProperties extends React.CSSProperties {
  anchorName?: string;
}

export type BoxProps = ElementProps & AlignmentConfig & {
  /**
   * Use to help with anchor positioning.
   */
  anchorName?: string,
  /**
   * Determines if the element should clip overflow
   */
  clip?: boolean,
  /**
   * Add a standardized gap between the children.
   */
  gap?: boolean;
  /**
   * Helps layout a group of buttons
   */
  infill?: boolean,
  /**
   * Add a standardized padding around the children.
   */
  padding?: boolean;
  /**
   * Set the priority intended for this component.
   * This will affect the final presentation.
   */
  priority?: 'primary' | 'secondary';
  /**
   * Set the purpose for this component.
   * This will affect the final presentation.
   */
  purpose?: 'surface' | 'action' | 'control';
  /**
   * Circular box.
   */
  round?: boolean,
  /**
   * Applies loading treatment to elements within this container.
   */
  standby?: boolean;
  /**
   * If set, makes the component stretch the width of the container.
   */
  stretch?: boolean;
  /**
   * If set, allows children to wrap to a new line.
   */
  wrap?: boolean;
};


export const box = proxy<HTMLTagsOnly, BoxProps>('box', (TagName) => {
  return forwardRef<HTMLElement, BoxProps>(({
    anchorName,
    clip,
    distribute,
    gap,
    infill,
    placeChildren,
    logical = true,
    placeSelf,
    padding,
    priority,
    purpose,
    round,
    stack,
    standby,
    stretch,
    wrap,
    ...props
  }: BoxProps, ref) => {
    const Box = element[TagName];

    const alignment = alignmentStyle({
      distribute,
      logical,
      placeChildren,
      placeSelf, 
      stack
    });

    const styles: ModernCSSProperties = {
      ...alignment,
      anchorName: anchorName,
      overflow: clip ? 'clip' : undefined,
      display: stretch ? 'flex' : 'inline-flex',
      flexGrow: stretch ? 1 : 0,
      flexDirection: stack ? 'column' : 'row',
      flexWrap: wrap || infill ? 'wrap' : 'nowrap',
      maxWidth: infill ? 'max-content' : undefined
    };

    const appearance: { [key: string]: boolean } = {};
    if (typeof purpose === 'string') {
      appearance[css[purpose]] = true;
    }

    const classNames = clsx(css.box, appearance, { 
      [css.round]: round,
      [css.padding]: padding,
      [css.gap]: gap || infill
    });

    return <Box
      { ...props }
      ref={ ref }
      className={ classNames }
      aria-busy={ standby }
      data-priority={ priority }
      style={ styles }/>;
  })
});
