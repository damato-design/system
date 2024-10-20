import { createElement, forwardRef } from 'react';
import { box, BoxProps } from '../Box';
import { text } from '../Text';
import { icon } from '../Icon';

type Accessory = 'menu' | 'external' | undefined;

function getAccessory(behavior: Accessory) {
    switch (behavior) {
        case 'menu':
            return <icon.expand_more />;
        case 'external':
            return <icon.launch />;
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
        /**
         * If set, component is expected to appear inline with content.
         */
        inline?: boolean
    };

export const Button = forwardRef<HTMLElement, ButtonProps>(({
    behavior,
    children,
    icon: iconRef,
    inline,
    role,
    type = 'button',
    ...props
}: ButtonProps, ref) => {
    const Element = 'href' in props ? box.a : box.button;
    const Text = inline ? text.span : text.strong;
    const spacing: { gap: true, padding?: boolean } = { gap: true };
    const inset = {
        block: 'center',
        inline: 'center'
    }
    if (['option', 'menuitem'].includes(role as string)) {
        inset.inline = 'start'
    }
    if (!inline) spacing.padding = true;

    if (!children && !props['aria-label']) {
        console.warn(`
            No children were provided,
            if this is an icon only button please add an 'aria-label' to the component
        `);
    }

    return (
        <Element
            {...Object.assign({ type }, props)}
            {...spacing}
            ref={ref}
            role={role}
            inset={inset}
            purpose='action'>
            {iconRef ? createElement(icon[iconRef]) : null}
            {children ? <Text priority='secondary'>{children}</Text> : null}
            {getAccessory(behavior)}
        </Element>
    )
})
