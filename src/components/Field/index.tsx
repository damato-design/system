import { forwardRef } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { restrictProps } from '../Element';
import { useFlyout } from '../Flyout';

export type FieldProps = BoxProps & {};

export const field = proxy<HTMLTagsOnly, FieldProps>('field', (TagName) => {
    return forwardRef<HTMLElement, FieldProps>(({
        stretch = true,
        ...props
    }: FieldProps, ref) => {

        const Element = box[TagName];
        const { anchor } = useFlyout();
        const placeSelf = !stretch ? 'start' : undefined;

        return (
            <Element
                { ...restrictProps(props) }
                { ...anchor }
                ref={ ref }
                stretch={ stretch }
                purpose='control'
                placeChildren='center'
                placeSelf={ placeSelf }/>
        )
    });
});
