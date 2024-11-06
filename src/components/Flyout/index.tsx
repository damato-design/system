import { forwardRef, useId, useEffect, useLayoutEffect } from 'react';
import css from './styles.module.scss';
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
  onClose?: (ev: any) => void
};

export const flyout = proxy<HTMLTagsOnly, FlyoutProps>('flyout', (TagName) => {
  return forwardRef<HTMLElement, FlyoutProps>(({
    getAnchorProps,
    behavior,
    stretch,
    onClose,
    className,
    style,
    ...props
  }: FlyoutProps, ref) => {

    const anchorId = useId();
    const targetId = useId();
    const name = `--${anchorId.replaceAll(':', '')}`;

    const Element = element[TagName];
    useLayoutEffect(() => {
      typeof getAnchorProps === 'function'
        && getAnchorProps({
          anchorName: name,
        });
    }, [getAnchorProps]);

    useLayoutEffect(() => {
      if (!document) return;
      const $target = document.getElementById(targetId);

      const onEscape = (ev: any) => {
        if (ev.key === 'Escape' && typeof onClose === 'function') onClose(ev);
      }

      const onOutside = (ev: any) => {
        const $elems = ev.composedPath();
        const isOutside = ![...$elems].some(($elem) => {
          const { anchorName, positionAnchor } = $elem?.style || {};
          return anchorName === name || positionAnchor === name;
        });
        if (isOutside && typeof onClose === 'function') onClose(ev);
      }

      if (!$target) return;
      document.documentElement.addEventListener('keyup', onEscape);
      document.documentElement.addEventListener('pointerdown', onOutside);

      $target.showPopover();
      return () => {
        document.documentElement.removeEventListener('keyup', onEscape);
        document.documentElement.removeEventListener('pointerdown', onOutside);
      };
    }, [targetId, anchorId, name, onClose]);

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
      popover='manual'
      ref={ ref }
      className={ css.flyout }
      style={ styles }/>;
  })
});
