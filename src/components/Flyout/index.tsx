import { forwardRef, useId, useLayoutEffect, createContext, useContext, Provider } from 'react';
import css from './styles.module.scss';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';

const FlyoutContext = createContext(null);

type FlyoutConfig = {
  anchor: { id: string, anchorName: string },
  target: { id: string }
}

/**
 * Creates the expected props from the current flyout context.
 * 
 * @returns {FlyoutConfig} - Props to be placed on the anchor and target
 */
export const useFlyout = () => {
  const context = useContext(FlyoutContext);
  return context || { anchor: {}, target: {} } as FlyoutConfig;
};

/**
 * The flyout provider element meant to wrap a flyout host component.
 * 
 * @param {Object} props - Configuration object
 * @returns {Provider} - A React context provider element
 */
export const FlyoutProvider = (props: any) => {
  const anchorId = useId()
  const targetId = useId();
  const anchorName = `--${anchorId.replaceAll(':', '')}`;

  const value = {
    anchor: { id: anchorId, anchorName },
    target: { id: targetId }
  }

  return <FlyoutContext.Provider { ...props } value={ value }/>
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

/**
 * Creates a `<flyout.tagName/>` component
 * 
 * @param {FlyoutProps} props - Component configuration object
 * @returns {ReactElement} - A flyout component
 */
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
    const { target, anchor } = useFlyout();

    useLayoutEffect(() => {
      if (!document || typeof target.id !=='string') return;
      const $target = document.getElementById(target.id);

      // Triggers is the Esc key is pressed.
      const onEscape = (ev: any) => {
        if (ev.key === 'Escape' && typeof onClose === 'function') onClose(ev);
      }

      // Triggers when an event occurs outside the flyout's content.
      const onOutside = (ev: any) => {
        const $elems = ev.composedPath();
        const isOutside = ![...$elems].some(($elem) => {
          const { anchorName: name, positionAnchor } = $elem?.style || {};
          return name === anchor.anchorName || positionAnchor === anchor.anchorName;
        });
        if (isOutside && typeof onClose === 'function') onClose(ev);
      }

      if (!$target) return;
      document.documentElement.addEventListener('keyup', onEscape);
      document.documentElement.addEventListener('pointerdown', onOutside);
      document.documentElement.addEventListener('focusin', onOutside);

      $target.showPopover();
      return () => {
        document.documentElement.removeEventListener('keyup', onEscape);
        document.documentElement.removeEventListener('pointerdown', onOutside);
        document.documentElement.removeEventListener('focusin', onOutside);
      };
    }, [target.id, anchor.anchorName, onClose]);

    const styles = {
      positionAnchor: anchor.anchorName,
      minWidth: stretch ? 'anchor-size(width)' : 'fit-content',
      top: `anchor(${anchor.anchorName} bottom)`,
      left: `anchor(${anchor.anchorName} left)`,
    }

    return <Element
      { ...restrictProps(props) }
      { ...target }
      role={ behavior }
      popover='manual'
      ref={ ref }
      className={ css.flyout }
      style={ styles }/>;
  })
});
