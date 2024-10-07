import React from 'react';
import { Props } from '../Element/proxy';
import { ElementComponentProps } from '../Element';
import { box } from '../Box';
import { text } from '../Text';
import { icon } from '../Icon';

type ElementProps = Props<HTMLButtonElement & HTMLAnchorElement> & ElementComponentProps;

export const Button = ({
    children,
    href,
    icon: iconRef,
    inline,
    ...props
}: ElementProps) => {
    const Element = href ? box.a : box.button;
    const spacing = { gap: true };
    if (!inline) spacing.padding = true;
    return (
        <Element { ...props } href={ href } { ...spacing } inset='center'>
            { iconRef ? React.createElement(icon[iconRef]) : null }
            <text.span>{ children }</text.span>
        </Element>
    )
}
