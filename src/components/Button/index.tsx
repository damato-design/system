import { createElement, forwardRef } from 'react';
import { ElementComponentProps } from '../Element';
import { box } from '../Box';
import { text } from '../Text';
import { icon } from '../Icon';

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type AnchorElementProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

type HTMLElementProps = AnchorElementProps | ButtonElementProps;

type ComponentProps = HTMLElementProps & ElementComponentProps & {
    icon?: string,
    inline?: boolean
};

export const Button = forwardRef<HTMLElement, ComponentProps>(({
    children,
    icon: iconRef,
    inline,
    ...props
}: ComponentProps, ref) => {
    const Element = 'href' in props ? box.a : box.button;
    const spacing: { gap: true, padding?: boolean } = { gap: true };
    if (!inline) spacing.padding = true;

    return (
        <Element { ...props } ref={ ref } { ...spacing } inset='center'>
            { iconRef ? createElement(icon[iconRef]) : null }
            <text.span priority='secondary'>{ children }</text.span>
        </Element>
    )
})
