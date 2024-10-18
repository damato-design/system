import { useEffect, useId, forwardRef } from 'react';
import { box, BoxProps } from '../Box';
import { text } from '../Text';

type FieldProps = BoxProps & {
    /**
     * The text that summarizes the purpose of the input.
     */
    label?: string,
    /**
     * Text that helps the user fill the input by providing more context.
     */
    helpMessage?: string,
    /**
     * A message that appears if the user input is invalid.
     */
    errorMessage?: string,
    /**
     * The `ref` linked to the `<input/>` element within the `<Field/>`.
     */
    inputRef: React.Ref<HTMLElement>,
    /**
     * Prop passed down to the internal `box` element for width behavior.
     * @default true
     */
    stretch?: boolean
};

export const Field = forwardRef<HTMLElement, FieldProps>(({
    children,
    label,
    helpMessage,
    errorMessage,
    inputRef,
    stretch = true,
    className,
    style,
    ...props
}: FieldProps, ref) => {

    const errorId = useId();
    const helpId = useId();

    useEffect(() => {
        if (typeof inputRef === 'function') return;
        if (!inputRef?.current) console.warn(`inputRef not provided to field, ref:`, inputRef);
        inputRef?.current?.setAttribute('aria-describedby', [errorId, helpId].join(' '));
    }, [inputRef]);

    const outset = !stretch ? { block: 'start' } : undefined;

    // TODO: use fieldset and legend?
    return (
        <box.div stack gap stretch={ stretch }>
            { label ? <text.label priority='secondary'>{ label }</text.label> : null }
            <box.div mode={ props.mode } stack gap>
                <text.p aria-live='polite' id={ errorId }>{ errorMessage }</text.p>
                <box.div
                    { ...props }
                    ref={ ref }
                    purpose='control'
                    inset={{ block: 'center' }}
                    outset={ outset }>
                    { children }
                </box.div>
            </box.div>
            <text.p id={ helpId }>{ helpMessage }</text.p>
        </box.div>
    )
})
