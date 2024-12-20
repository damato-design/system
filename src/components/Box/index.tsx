import { forwardRef } from 'react';
import clsx from 'clsx';
import boxClass from './box.module.scss';
import surfaceClass from './surface.module.scss';
import actionClass from './action.module.scss';
import controlClass from './control.module.scss';
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
   * Display box using CSS Grid
   */
  grid?: boolean;
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
   * Forces the container into a square shape
   */
  square?: boolean,
  /**
   * Applies loading treatment to elements within this container.
   */
  standby?: boolean;
  /**
   * If set, makes the component stretch the width of the container.
   */
  stretch?: boolean;
  /**
   * If set, makes the component shrink based on surroundings.
   */
  shrink?: boolean;
  /**
   * Number of columns to span for grid children
   */
  span?: number;
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
    grid,
    infill,
    placeChildren,
    logical = true,
    placeSelf,
    padding,
    priority,
    purpose,
    round,
    span,
    square,
    stack,
    standby,
    stretch,
    shrink = true,
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

    const display = grid ? 'grid' : 'flex';

    const styles: ModernCSSProperties = {
      ...alignment,
      anchorName: anchorName,
      aspectRatio: square ? '1' : undefined,
      overflow: clip ? 'clip' : undefined,
      display: stretch ? display : `inline-${display}`,
      flexGrow: Number(!!stretch),
      flexDirection: stack ? 'column' : 'row',
      flexWrap: wrap || infill ? 'wrap' : 'nowrap',
      flexShrink: Number(!!shrink),
      maxWidth: infill ? 'max-content' : undefined,
      gridColumn: typeof span === 'number' ? `span ${span}` : undefined
    };

    const classNames = clsx(boxClass.box, { 
      [boxClass.round]: round,
      [boxClass.padding]: padding,
      [boxClass.gap]: gap || infill,
      [boxClass.grid]: grid,
      [surfaceClass.surface]: purpose === 'surface',
      [actionClass.action]: purpose === 'action',
      [controlClass.control]: purpose === 'control'
    });

    return <Box
      { ...props }
      ref={ ref }
      className={ classNames }
      aria-busy={ standby ? true : undefined }
      data-priority={ priority }
      style={ styles }/>;
  })
});
