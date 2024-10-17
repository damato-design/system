import { useEffect, useId, forwardRef } from 'react';
import { ElementComponentProps } from '../Element';
import { box } from '../Box';
import { text } from '../Text';

type ComponentProps = ElementComponentProps & {
    label?: string,
    helpMessage?: string,
    errorMessage?: string,
    inputRef: React.Ref<HTMLElement>,
    stretch?: boolean
};

export const Field = forwardRef<HTMLElement, ComponentProps>(({
    children,
    className,
    style,
    label,
    helpMessage,
    errorMessage,
    inputRef,
    stretch = true,
    ...props
}: ComponentProps, ref) => {

    const errorId = useId();
    const helpId = useId();

    useEffect(() => {
        if (typeof inputRef === 'function') return;
        if (!inputRef?.current) console.warn(`inputRef not provided to field, ref:`, inputRef);
        inputRef?.current?.setAttribute('aria-describedby', [errorId, helpId].join(' '));
    }, [inputRef]);

    return (
        <box.div stack gap stretch={ stretch }>
            { label ? <text.label priority='secondary'>{ label }</text.label> : null }
            <box.div mode={ props.mode } stack gap>
                <text.p aria-live='polite' id={ errorId }>{ errorMessage }</text.p>
                <box.div { ...props } ref={ ref } purpose='control' inset={{ block: 'center' }}>
                    { children }
                </box.div>
            </box.div>
            <text.p id={ helpId }>{ helpMessage }</text.p>
        </box.div>
    )
})
