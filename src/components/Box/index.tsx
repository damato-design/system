import { forwardRef, useCallback, useMemo, useState } from 'react';
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

export type BoxProps = _BoxProps & {
  reflow?: Record<number, _BoxProps>
}

function thresholdMatches(thresholds: number[], width: number) {
  return thresholds.reduce((acc: number[], threshold) => {
    return width <= threshold ? acc.concat(threshold) : acc ;
  }, []);
}

export const box = proxy<HTMLTagsOnly, BoxProps>('box', (TagName) => {
  return forwardRef<HTMLElement, BoxProps>(({
    reflow = {},
    ...originalProps
  }: BoxProps, ref) => {
    const Box = element[TagName];
    const [threshold, setThreshold] = useState(Infinity);
    const reflowWidths = useMemo(() => Object.keys(reflow).map(Number) || [], [reflow]);

    const resizeObserve = useCallback(($elem: HTMLElement) => {
      if (!$elem) return;

      if (typeof ref === "function") {
        ref($elem);
      } else if (ref) {
        ref.current = $elem;
      }

      if (!reflowWidths.length) return;

      const observer = new ResizeObserver(([entry]) => {
        requestAnimationFrame(() => {
          const matches = thresholdMatches(reflowWidths, entry.contentRect.width);
          setThreshold(Math.min(...matches));
        })
      });
      observer.observe($elem);
      // TODO: Cleanup observer on dismount?
    }, [reflowWidths]);

    const reflowProps = useMemo(() => {
      return thresholdMatches(reflowWidths, threshold)
        .reduce((acc, key) => Object.assign(acc, reflow[key]), originalProps)
    }, [reflowWidths, threshold]);

    const {
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
    } = reflowProps;

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
      borderRadius: round === false ? 0 : undefined,
      border: round === false ? 0 : undefined,
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
      ref={ resizeObserve }
      className={ classNames }
      aria-busy={ standby ? true : undefined }
      data-priority={ priority }
      style={ styles }/>;
  })
});
