import { forwardRef } from 'react';
import clsx from 'clsx';
import css from './styles.module.scss';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';

type Position = string | undefined;

const LOGICAL_REPLACEMENT = {
  top: 'start',
  bottom: 'end',
  left: 'start',
  right: 'end',
};

function updateLogical(position: string) {
  return (LOGICAL_REPLACEMENT as any)[position] || position;
}

function createLayout(position: Position, logical: boolean) {
  if (!position) return [null, null];

  // Expecting vertical-horizontal (eg., top-start)
  const layout = position.split('-');

  if (layout.length === 1) {
    // Shorthand is missing center

    if (!['top', 'bottom'].includes(layout[0])) {
      // Horizontal placement, center is vertical
      layout.unshift('center');
    }

    if (layout.length === 1) {
      // Vertical placeholder, center is horizontal
      layout.push('center');
    }
  }

  return [
    updateLogical(layout[0]),
    !logical ? layout[1] : updateLogical(layout[1])
  ];
}

interface ModernCSSProperties extends React.CSSProperties {
  anchorName?: string;
}

export type BoxProps = ElementProps & {
  /**
   * Use to help with anchor positioning.
   */
  anchorName?: string,
  /**
   * Determines if the element should clip overflow
   */
  clip?: boolean,
  /**
   * How to distribute the space across children.
   */
  distribute?: 'between' | 'around' | 'evenly';
  /**
   * Add a standardized gap between the children.
   */
  gap?: boolean;
  /**
   * Determines if the layout options should use logical properties.
   * @default true
   */
  logical?: boolean;
  /**
   * Helps layout a group of buttons
   */
  infill?: boolean,
  /**
   * Set the alignment for the children within the element.
   */
  placeChildren?: Position;
  /**
   * Set the alignment for this component.
   */
  placeSelf?: Position;
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
   * If set, makes children align vertically.
   */
  stack?: boolean;
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

    const innerLayout = createLayout(placeChildren, logical);
    const outerLayout = createLayout(placeSelf, logical);

    if (stack) {
      innerLayout.reverse();
    }

    const styles: ModernCSSProperties = {
      anchorName: anchorName,
      overflow: clip ? 'clip' : undefined,
      justifyContent: distribute ? `space-${distribute}` : innerLayout.at(1),
      alignItems: innerLayout.at(0),
      display: stretch ? 'flex' : 'inline-flex',
      flex: stretch && !['action', 'control'].includes(purpose as string) ? 1 : undefined,
      flexDirection: stack ? 'column' : 'row',
      flexWrap: wrap || infill ? 'wrap' : 'nowrap',
      justifySelf: outerLayout.at(1),
      alignSelf: outerLayout.at(0),
      padding: padding ? 'var(--padding, 1rem)' : undefined,
      gap: gap || infill ? 'var(--gap, .5rem)' : undefined,
      maxWidth: infill ? 'max-content' : undefined
    };

    const appearance: { [key: string]: boolean } = {};
    if (typeof purpose === 'string') {
      appearance[css[purpose]] = true;
    }

    const classNames = clsx(css.box, appearance, { 
      [css.round]: round,
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
