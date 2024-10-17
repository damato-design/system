import { createElement, forwardRef } from 'react';
import { Props } from '../Element/proxy';
import { ElementComponentProps } from '../Element';
import { box } from '../Box';
import { text } from '../Text';
import { icon } from '../Icon';

type ButtonProps = Props<HTMLButtonElement> | Props<HTMLAnchorElement>

type ComponentProps =  ButtonProps & ElementComponentProps & {
    icon?: string,
    inline?: boolean
};

export const Button = forwardRef<HTMLElement, ComponentProps>(({
    children,
    href,
    icon: iconRef,
    inline,
    ...props
}: ComponentProps, ref) => {
    const Element = href ? box.a : box.button;
    const spacing = { gap: true };
    if (!inline) spacing.padding = true;

    return (
        <Element { ...props } ref={ ref } href={ href } { ...spacing } inset='center'>
            { iconRef ? createElement(icon[iconRef]) : null }
            <text.span>{ children }</text.span>
        </Element>
    )
})
