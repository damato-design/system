import { forwardRef } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { Media } from '../Media';
import { lockup, LockupProps } from '../Lockup';
import { restrictProps } from '../Element';

export type CardProps = BoxProps
    & LockupProps
    & {
        maxWidth?: string,
        src?: string
    };

export const card = proxy<HTMLTagsOnly, CardProps>('card', (TagName) => {
    return forwardRef<HTMLElement, CardProps>(({
        maxWidth,
        stack = true,
        src,
        icon,
        children,
        subject,
        passiveMessage,
        errorMessage,
        ...props
    }: CardProps, ref) => {

        const Element = box[TagName];
        const content = (
            <lockup.div
                {...{
                    children,
                    icon,
                    subject,
                    passiveMessage,
                    errorMessage,
                }}
                placeSelf='bottom-start'
                stack
                gap/>
        )

        return (
            <Element
                { ...restrictProps(props) }
                gap
                stack={ stack }
                ref={ ref }>
                { src ? <Media src={ src } maxWidth={ maxWidth }/> : null }
                { subject || children ? content : null }
            </Element>
        )
    });
});
