import { forwardRef } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';

type FieldProps = BoxProps & {};

export const field = proxy<HTMLTagsOnly, FieldProps>('field', (TagName) => {
    return forwardRef<HTMLElement, FieldProps>(({
        stretch = true,
        ...props
    }: FieldProps, ref) => {

        const Element = box[TagName];
        const outset = !stretch ? { block: 'start' } : undefined;

        return (
            <Element
                { ...props }
                ref={ ref }
                stretch={ stretch }
                purpose='control'
                inset={{ block: 'center' }}
                outset={ outset }/>
        )
    });
});
