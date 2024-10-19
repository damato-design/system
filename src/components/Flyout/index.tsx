import { forwardRef, useLayoutEffect, useId } from 'react';
import css from './styles.module.css';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';

export type FlyoutProps = ElementProps & {
  /**
    * The `ref` linked to the "anchor" element associated with the `<Flyout/>`.
    */
  anchorRef: React.Ref<HTMLElement>,
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
    anchorRef,
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

    useLayoutEffect(() => {
      if (typeof anchorRef === 'function' || !anchorRef?.current) return;
      if (anchorRef.current.tagName !== 'BUTTON') console.warn(`Flyouts can only be anchored to <button/>`);
      anchorRef.current.style.setProperty('anchor-name', name);
      anchorRef.current.setAttribute('popovertarget', targetId);
      if (disclosure === 'manual') anchorRef.current.setAttribute('popovertargetaction', 'toggle');
      anchorRef.current.id = anchorId;
    }, [anchorRef]);

    const Element = element[TagName];

    const styles = {
      positionAnchor: name,
      minWidth: stretch ? 'anchor-size(width)' : 'fit-content',
      top: `anchor(${name} bottom)`,
      left: `anchor(${name} left)`,
    }

    return <Element
      { ...props }
      id={ targetId }
      role={ behavior }
      anchor={ anchorId }
      popover={ disclosure }
      ref={ ref }
      className={ css.flyout }
      style={ styles }/>;
  })
});
