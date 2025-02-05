import { createElement, forwardRef, ReactElement, ReactNode } from 'react';
import { box, BoxProps } from '../Box';
import { icon } from '../Icon';
import { IDREF } from '../Localize';
import { useFlyout } from '../Flyout';
import { useListbox } from '../Listbox';

type Accessory = 'menu' | 'external' | 'dismiss' | undefined;

/**
 * Returns the appropriate icon accessory based on the expected behavior.
 * 
 * @param {Accessory} behavior - enum representing how the component is meant to behave.
 * @returns {ReactElement} - an `<icon/>` element
 */
function getAccessory(behavior: Accessory) {
    switch (behavior) {
        case 'menu':
            return <icon.expand_more />;
        case 'external':
            return <icon.launch />;
        case 'dismiss':
            return <icon.close />
        default:
            return null;
    }
}

export type ButtonProps = (React.ButtonHTMLAttributes<HTMLButtonElement>
    | React.AnchorHTMLAttributes<HTMLAnchorElement>)
    & BoxProps
    & {
        /**
         * Includes an additional accessory to the button.
         */
        behavior?: Accessory,
        /**
         * A string reference to an `<icon/>` element.
         */
        icon?: string,
    };

/**
 * Determines if this should render as an icon-only element.
 * 
 * @param {ButtonProps} props - Configuration object
 * @param {String} [props.icon] - String identifier for an icon
 * @param {ReactNode} [props.children] - Child elements
 * @param {Accessory} [props.behavior] - The expected behavior of the element
 * @returns {Boolean} - Determines if the icon should render or not
 */
function iconOnly({ icon, children, behavior }: ButtonProps): boolean {
    if (children) return false;
    return !Boolean(icon && behavior);
}

/**
 * Creates a `<Button/>` component
 * 
 * @param {ButtonProps} props - Component configuration object
 * @returns {ReactElement} - A button component
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(({
    behavior,
    children,
    icon: iconRef,
    role,
    square,
    type = 'button',
    ...props
}: ButtonProps, ref) => {
    const Element = 'href' in props ? box.a : box.button;
    const { anchor: flyoutProps } = useFlyout();
    const { anchor: listboxProps } = useListbox();

    const config = Object.assign({}, props, {
        'aria-labelledby': props['aria-labelledby'],
        'aria-label': behavior === 'dismiss' ? 'Close' : props['aria-label'],
        placeChildren: 'center',
        type,
        role,
        gap: true,
        square: square || iconOnly({ icon: iconRef, children, behavior })
    });

    // Configure ARIA from given props.
    const ariaLabelledby = [props['aria-labelledby']];
    if (behavior === 'dismiss') ariaLabelledby.push(IDREF.close);
    config['aria-labelledby'] = ariaLabelledby.filter(Boolean).join(' ') || undefined;

    // If this is meant as a menu item, align content to the starting edge.
    if (['option', 'menuitem'].includes(role as string)) {
        config.placeChildren = 'start'
    }

    // Warn if given props would make component inaccessible.
    if (!children && !(config['aria-label'] || config['aria-labelledby'])) {
        console.warn(`
            No children were provided,
            if this is an icon only button please add
            an 'aria-label' or 'aria-labelledby' to the component.
        `);
    }

    return (
        <Element
            { ...config }
            { ...flyoutProps }
            { ...listboxProps }
            ref={ref}
            purpose='action'>
            {iconRef ? createElement(icon[iconRef]) : null}
            {children}
            {getAccessory(behavior)}
        </Element>
    )
})
