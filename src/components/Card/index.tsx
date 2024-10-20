import { forwardRef } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { Media, MediaProps } from '../Media';
import { lockup, LockupProps } from '../Lockup';

type FieldProps = BoxProps
    & MediaProps 
    & LockupProps
    & {

    };

export const card = proxy<HTMLTagsOnly, FieldProps>('card', (TagName) => {
    return forwardRef<HTMLElement, FieldProps>(({
        stack = true,
        src,
        icon,
        children,
        subject,
        passiveMessage,
        errorMessage,
        getInputProps,
        onClose,
        ...props
    }: FieldProps, ref) => {

        const Element = box[TagName];

        // TODO: Reduce density for the lockup
        return (
            <Element
                { ...props }
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
                        getInputProps,
                        onClose
                    }}
                    stack
                    gap/>
            </Element>
        )
    });
});
