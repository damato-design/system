import { forwardRef, ReactNode } from 'react';
import { box, BoxProps } from '../Box';
import { icon } from '../Icon';

type DisclosureProps = BoxProps & {
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

    return (
        <box.details { ...rest } ref={ ref } name={ name } stretch stack>
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
        </box.details>
    );
});
