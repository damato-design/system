import { forwardRef, ReactNode } from 'react';
import { box, BoxProps } from '../Box';
import { Intrinsic } from '../Element';
import { icon } from '../Icon';

export type DisclosureProps = BoxProps & {
    subject: ReactNode,
    name?: string
};

/**
 * Creates a `<Disclosure/>` component
 * 
 * @param {DisclosureProps} props - Component configuration object
 * @returns {ReactElement} - A disclosure component
 */
export const Disclosure = forwardRef<HTMLElement, DisclosureProps>(({
    name,
    subject,
    children,
    ...rest
}: DisclosureProps, ref) => {

    // Typed as details so it accepts the native `name` (exclusive accordion).
    const Details = box.details as Intrinsic<typeof box.details, 'details'>;

    return (
        <Details { ...rest } ref={ ref } name={ name } stretch stack>
            <box.summary
                purpose='action'
                padding
                stretch
                distribute='between'
                placeChildren='center'>
                { subject }
                <icon.expand_more/>
            </box.summary>
            { children }
        </Details>
    );
});
