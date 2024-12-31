import { createElement, forwardRef } from 'react';
import { box, BoxProps } from '../Box';
import { icon } from '../Icon';
import { IDREF } from '../Localize';
import { useFlyout } from '../Flyout';
import { useListbox } from '../Listbox';

type Accessory = 'menu' | 'external' | 'dismiss' |undefined;

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

function iconOnly({ icon, children, behavior }: ButtonProps): boolean {
    if (children) return false;
    return !Boolean(icon && behavior);
}

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

    const ariaLabelledby = [props['aria-labelledby']];
    if (behavior === 'dismiss') ariaLabelledby.push(IDREF.close);
    config['aria-labelledby'] = ariaLabelledby.filter(Boolean).join(' ') || undefined;

    if (['option', 'menuitem'].includes(role as string)) {
        config.placeChildren = 'start'
    }

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
