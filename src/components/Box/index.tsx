import { forwardRef } from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';

type Position = 'start' | 'center' | 'end' | string | undefined;
type MixedPosition = { inline?: Position, block?: Position } | Position | undefined;

function updateLogical(position: string | undefined) {
  switch (position) {
    case 'left':
    case 'top':
      return 'start';
    case 'right':
    case 'bottom':
      return 'end';
    default:
      return position;
  }
}

function createLayout(position: MixedPosition, logical: boolean) {
  const layout: [string?, string?] = [
    typeof position === 'object' ? position?.inline : position,
    typeof position === 'object' ? position?.block : position,
  ];

  return logical ? layout.map(updateLogical) : layout;
}

export type BoxProps = ElementProps & {
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
   * Set the alignment for the children within the element.
   */
  inset?: MixedPosition;
  /**
   * Set the alignment for this component.
   */
  outset?: MixedPosition;
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
   * If set, makes children align vertically.
   */
  stack?: boolean;
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
    distribute,
    gap,
    inset,
    logical = true,
    outset,
    padding,
    priority,
    purpose,
    stack,
    stretch,
    wrap,
    className,
    style,
    ...props
  }: BoxProps, ref) => {
    const Box = element[TagName];

    const innerLayout = createLayout(inset, logical);
    const outerLayout = createLayout(outset, logical);

    if (stack) {
      innerLayout.reverse();
    }

    const styles: React.CSSProperties = {
      justifyContent: distribute ? `space-${distribute}` : innerLayout.at(0),
      alignItems: innerLayout.at(1),
      display: stretch ? 'flex' : 'inline-flex',
      flex: stretch ? 1 : 'initial',
      flexDirection: stack ? 'column' : 'row',
      flexWrap: wrap ? 'wrap' : 'nowrap',
      justifySelf: outerLayout.at(0),
      alignSelf: outerLayout.at(1),
      padding: padding ? 'var(--padding, 1rem)' : undefined,
      gap: gap ? 'var(--gap, .5rem)' : undefined
    };

    const appearance: { [key: string]: boolean } = {};
    if (typeof purpose === 'string') {
      appearance[css[purpose]] = true;
    }

    const classNames = clsx(css.box, appearance);

    return <Box
      { ...props }
      ref={ ref }
      className={ classNames }
      data-priority={ priority }
      style={ styles }/>;
  })
});
