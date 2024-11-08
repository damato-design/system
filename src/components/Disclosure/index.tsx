import { forwardRef, ReactNode } from "react";
import { box, BoxProps } from '../Box';
import { icon } from '../Icon';

type DisclosureProps = BoxProps & {
    subject: ReactNode,
};

export const Disclosure = forwardRef<HTMLElement, DisclosureProps>(({
    subject,
    children,
    ...rest
}: DisclosureProps, ref) => {

    return (
        <box.details { ...rest } ref={ ref } stretch stack>
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
