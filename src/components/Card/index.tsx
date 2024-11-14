import { forwardRef } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { Media, MediaProps } from '../Media';
import { lockup, LockupProps } from '../Lockup';
import { restrictProps } from '../Element';

type CardProps = BoxProps
    & MediaProps 
    & LockupProps;

export const card = proxy<HTMLTagsOnly, CardProps>('card', (TagName) => {
    return forwardRef<HTMLElement, CardProps>(({
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

        return (
            <Element
                { ...restrictProps(props) }
                gap
                stack={ stack }
                ref={ ref }>
                <Media src={ src }/>
                <lockup.div
                    {...{
                        children,
                        icon,
                        subject,
                        passiveMessage,
                        errorMessage,
                    }}
                    stack
                    gap/>
            </Element>
        )
    });
});
