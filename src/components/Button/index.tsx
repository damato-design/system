import { Props } from '../Element/proxy';
import { ElementComponentProps } from '../Element';
import { box } from '../Box';
import { text } from '../Text';

type ElementProps = Props<HTMLButtonElement & HTMLAnchorElement> & ElementComponentProps;

export const Button = ({
    children,
    href,
    icon,
    inline,
    ...props
}: ElementProps) => {
    const Element = href ? box.a : box.button;
    const spacing = { gap: true };
    if (!inline) spacing.padding = true;
    return (
        <Element { ...props } href={ href } { ...spacing }>
            <text.span>{ children }</text.span>
        </Element>
    )
}
