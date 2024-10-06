import clsx from 'clsx';
import css from './styles.module.css';
import { proxy, Props, HTMLTagsOnly } from './proxy';

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

export interface ElementComponentProps extends Props {
  distribute?: 'between' | 'around' | 'evenly';
  gap?: boolean;
  inset?: MixedPosition;
  logical?: boolean;
  mode?: string,
  outset?: MixedPosition;
  padding?: boolean;
  priority?: 'primary' | 'secondary';
  screenreaderOnly?: string;
  stack?: boolean;
  /**
   * Presents the component as loading.
   */
  standby?: boolean;
  stretch?: boolean;
  wrap?: boolean;
}

export const element = proxy<HTMLTagsOnly, Props>('element', (TagName) => {
  return ({
    distribute,
    gap,
    inset,
    logical = true,
    mode,
    outset,
    padding,
    priority,
    screenreaderOnly,
    stack,
    standby,
    stretch,
    wrap,
    className,
    style,
    ...rest
  }: ElementComponentProps) => {

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

    const classNames = clsx(className, css.element, {
      [css.gap]: gap,
      [css.padding]: padding
    });

    return (
      <TagName
        {...rest}
        aria-describedby={screenreaderOnly}
        className={classNames}
        data-mode={mode}
        data-priority={priority}
        data-standby={standby}
        style={Object.assign(styles, style)} />
    )
  }
});
