import { forwardRef, useId, useLayoutEffect, createContext, useContext } from 'react';
import css from './styles.module.scss';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';

const FlyoutContext = createContext(null);

export const useFlyout = () => {
  const context = useContext(FlyoutContext);
  return context || { anchorId: undefined, targetId: undefined, anchorName: undefined };
};

export const FlyoutProvider = (props: any) => {
  const anchorId = useId()
  const targetId = useId();
  const anchorName = `--${anchorId.replaceAll(':', '')}`;

  return <FlyoutContext.Provider { ...props } value={{ anchorId, targetId, anchorName }}/>
}

export type FlyoutProps = ElementProps & {
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
    behavior,
    stretch,
    onClose,
    className,
    style,
    ...props
  }: FlyoutProps, ref) => {

    const Element = element[TagName];
    const { targetId, anchorName } = useFlyout();

    useLayoutEffect(() => {
      if (!document || typeof targetId !=='string') return;
      const $target = document.getElementById(targetId);

      const onEscape = (ev: any) => {
        if (ev.key === 'Escape' && typeof onClose === 'function') onClose(ev);
      }

      const onOutside = (ev: any) => {
        const $elems = ev.composedPath();
        const isOutside = ![...$elems].some(($elem) => {
          const { anchorName: name, positionAnchor } = $elem?.style || {};
          return name === anchorName || positionAnchor === anchorName;
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
    }, [targetId, anchorName, onClose]);

    const styles = {
      positionAnchor: anchorName,
      minWidth: stretch ? 'anchor-size(width)' : 'fit-content',
      top: `anchor(${anchorName} bottom)`,
      left: `anchor(${anchorName} left)`,
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
