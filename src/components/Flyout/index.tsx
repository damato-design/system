import { forwardRef, useId, createContext, useContext } from 'react';
import css from './styles.module.scss';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';

const FlyoutContext = createContext(null);

type FlyoutConfig = {
  anchor: { id: string, anchorName: string, commandfor?: string, command?: string },
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
    // A button anchor toggles the popover via the Invoker Commands API. The
    // browser exempts an invoker from immediately light-dismissing the popover
    // it opens, which a manual click handler cannot do. These ride in the opaque
    // anchor bag, so the button spreads them without knowing about flyouts.
    anchor: { id: anchorId, anchorName, commandfor: targetId, command: 'toggle-popover' },
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
   * Called when the popover is dismissed (Esc, outside click or on close).
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

    const styles = {
      positionAnchor: anchor.anchorName,
      minWidth: stretch ? 'anchor-size(width)' : 'fit-content',
      top: `anchor(${anchor.anchorName} bottom)`,
      left: `anchor(${anchor.anchorName} left)`,
    }

    // Fully declarative: a button anchor opens/toggles it via its command, the
    // browser handles light-dismiss (Esc, outside click), and the native
    // `toggle` event reports dismissal back through `onClose`.
    return <Element
      { ...restrictProps(props) }
      { ...target }
      role={ behavior }
      // A tooltip is a `hint` so opening it never dismisses an open `auto`
      // popover (eg. a menu); everything else is a standard `auto` popover.
      popover={ behavior === 'tooltip' ? 'hint' : 'auto' }
      ref={ ref }
      onToggle={ (ev: any) => ev.nativeEvent?.newState === 'closed' && onClose?.(ev) }
      className={ css.flyout }
      style={ styles }/>;
  })
});
