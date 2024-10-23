import { forwardRef, useId, useEffect } from 'react';
import css from './styles.module.css';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';

export type FlyoutProps = ElementProps & {
  /**
    * The `ref` linked to the "anchor" element associated with the `<Flyout/>`.
    */
  getAnchorProps: ({}) => void,
  /**
   * Matches the accessibility role for the content.
   */
  behavior?: 'menu' | 'listbox' | 'tooltip',
  /**
   * Stretch the full width of the anchor.
   */
  stretch?: boolean,
  /**
   * Determines how the element should interact with the anchor.
   */
  disclosure?: 'auto' | 'manual'
};

export const flyout = proxy<HTMLTagsOnly, FlyoutProps>('flyout', (TagName) => {
  return forwardRef<HTMLElement, FlyoutProps>(({
    getAnchorProps,
    behavior,
    stretch,
    disclosure = 'auto',
    className,
    style,
    ...props
  }: FlyoutProps, ref) => {

    const anchorId = useId();
    const targetId = useId();
    const name = `--${anchorId.replaceAll(':', '')}`;

    const Element = element[TagName];
    useEffect(() => {
      typeof getAnchorProps === 'function'
        && getAnchorProps({
          popovertarget: targetId,
          anchorName: name,
          popovertargetaction: disclosure ? 'toggle' : null
        });
    }, [getAnchorProps]);

    const styles = {
      positionAnchor: name,
      minWidth: stretch ? 'anchor-size(width)' : 'fit-content',
      top: `anchor(${name} bottom)`,
      left: `anchor(${name} left)`,
    }

    return <Element
      { ...restrictProps(props) }
      id={ targetId }
      role={ behavior }
      popover={ disclosure }
      ref={ ref }
      className={ css.flyout }
      style={ styles }/>;
  })
});
