import { createElement, forwardRef } from 'react';
import { box, BoxProps } from '../Box';
import { text } from '../Text';
import { icon } from '../Icon';

type ComponentProps = (React.ButtonHTMLAttributes<HTMLButtonElement>
    | React.AnchorHTMLAttributes<HTMLAnchorElement>)
    & BoxProps
    & {
        icon?: string,
        inline?: boolean
    };

export const Button = forwardRef<HTMLElement, ComponentProps>(({
    children,
    icon: iconRef,
    inline,
    className,
    style,
    type = 'button',
    ...props
}: ComponentProps, ref) => {
    const Element = 'href' in props ? box.a : box.button;
    const Text = inline ? text.span : text.strong;
    const spacing: { gap: true, padding?: boolean } = { gap: true };
    if (!inline) spacing.padding = true;

    return (
        <Element
            {...Object.assign({ type }, props)}
            {...spacing}
            ref={ref}
            inset='center'
            purpose='action'>
            {iconRef ? createElement(icon[iconRef]) : null}
            {children ? <Text priority='secondary'>{children}</Text> : null}
        </Element>
    )
})
