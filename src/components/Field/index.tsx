import { forwardRef } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { restrictProps } from '../Element';
import { useFlyout } from '../Flyout';

export type FieldProps = BoxProps & {};

export const field = proxy<HTMLTagsOnly, FieldProps>('field', (TagName) => {
    return forwardRef<HTMLElement, FieldProps>(({
        ...props
    }: FieldProps, ref) => {

        const Element = box[TagName];
        const { anchor } = useFlyout();

        return (
            <Element
                { ...restrictProps(props) }
                { ...anchor }
                ref={ ref }
                purpose='control'/>
        )
    });
});
