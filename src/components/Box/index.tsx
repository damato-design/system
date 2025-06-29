import { forwardRef } from 'react';
import clsx from 'clsx';
import boxClass from './box.module.scss';
import surfaceClass from './surface.module.scss';
import actionClass from './action.module.scss';
import controlClass from './control.module.scss';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';
import { alignmentStyle, AlignmentConfig } from './alignment';
import { useReflow, ReflowProp } from './reflow';

// React.CSSProperties does not include anchorName
interface ModernCSSProperties extends React.CSSProperties {
  anchorName?: string;
}

type _BoxProps = ElementProps & AlignmentConfig & {
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
  columns?: boolean | number;
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

export type BoxProps = _BoxProps & ReflowProp<_BoxProps>;

/**
 * Creates a `<box.tagName/>` component
 * 
 * @param {BoxProps} props - Component configuration object
 * @returns {ReactElement} - A box component
 */
export const box = proxy<HTMLTagsOnly, BoxProps>('box', (TagName) => {
  return forwardRef<HTMLElement, BoxProps>((originalProps: BoxProps, ref) => {
    const Box = element[TagName];

    const {
      anchorName,
      clip,
      distribute,
      gap,
      columns,
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
      key,
      ...props
    } = useReflow<HTMLElement, BoxProps>(originalProps, ref);

    const alignment = alignmentStyle({
      distribute,
      logical,
      placeChildren,
      placeSelf, 
      stack
    });

    const display = Boolean(columns) ? 'grid' : 'flex';

    const styles: ModernCSSProperties = {
      ...alignment,
      anchorName: anchorName,
      aspectRatio: square ? '1' : undefined,
      overflow: clip ? 'clip' : undefined,
      display: stretch ? display : `inline-${display}`,
      borderRadius: round === false ? 0 : undefined,
      border: round === false ? 0 : undefined,
      flexGrow: Number(!!stretch),
      flexDirection: stack ? 'column' : 'row',
      flexWrap: wrap || infill ? 'wrap' : 'nowrap',
      flexShrink: Number(!!shrink),
      maxWidth: infill ? 'max-content' : undefined,
      gridColumn: typeof span === 'number' ? `span ${span}` : undefined,
    };

    if (columns) {
      styles.gridTemplateColumns = typeof columns === 'number'
        ? `repeat(${columns}, minmax(auto, 430px))`
        : `repeat(auto-fill, minmax(260px, 1fr))`
    }

    const classNames = clsx(boxClass.box, {
      [boxClass.round]: round,
      [boxClass.padding]: padding,
      [boxClass.gap]: gap || infill,
      [surfaceClass.surface]: purpose === 'surface',
      [actionClass.action]: purpose === 'action',
      [controlClass.control]: purpose === 'control'
    });

    return <Box
      { ...props }
      key={ key }
      className={ classNames }
      aria-busy={ standby ? true : undefined }
      data-priority={ priority }
      style={ styles }/>;
  })
});
