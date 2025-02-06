import { forwardRef } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { restrictProps } from '../Element';
import { useFlyout } from '../Flyout';

export type FieldProps = BoxProps & {};

/**
 * Creates a `<field.tagName/>` component
 * 
 * @param {FieldProps} props - Component configuration object
 * @returns {ReactElement} - A field component
 */
export const field = proxy<HTMLTagsOnly, FieldProps>('field', (TagName) => {
    return forwardRef<HTMLElement, FieldProps>(({
        placeChildren = 'start',
        ...props
    }: FieldProps, ref) => {

        const Element = box[TagName];
        const { anchor } = useFlyout();

        return (
            <Element
                { ...restrictProps(props) }
                { ...anchor }
                placeChildren={ placeChildren }
                ref={ ref }
                purpose='control'/>
        )
    });
});
