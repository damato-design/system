import { forwardRef } from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { proxy, Props, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type Position = 'start' | 'center' | 'end';
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

type ComponentProps = Props<HTMLElement> & ElementComponentProps & {
  distribute?: 'between' | 'around' | 'evenly';
  gap?: boolean;
  logical?: boolean;
  inset?: MixedPosition;
  outset?: MixedPosition;
  padding?: boolean;
  priority?: 'primary' | 'secondary';
  stack?: boolean;
  stretch?: boolean;
  wrap?: boolean;
};

export const box = proxy<HTMLTagsOnly, ComponentProps>('box', (TagName) => {
  return forwardRef<HTMLElement, ComponentProps>(({
    distribute,
    gap,
    inset,
    logical = true,
    outset,
    padding,
    priority,
    stack,
    stretch,
    wrap,
    ...props
  }: ComponentProps, ref) => {
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
      alignSelf: outerLayout.at(1)
    };

    const classNames = clsx(css.box, {
      [css.gap]: gap,
      [css.padding]: padding
    });

    return <Box
      { ...props }
      ref={ ref }
      className={ classNames }
      data-priority={ priority }
      style={ styles }/>;
  })
});
