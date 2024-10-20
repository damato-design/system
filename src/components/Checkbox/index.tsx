import { forwardRef, useId } from 'react';
import { field } from '../Field';
import { input, InputProps } from '../Input';
import { box } from '../Box';
import { text } from '../Text';

type CheckboxProps = InputProps & {
    name: string,
    exclusive?: boolean,
    label?: string,
};

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(({
    exclusive,
    label,
    ...props
}, ref) => {
    // TODO: needs focus-within approach
    const id = useId();

    return (
        <box.div stack={ false } gap inset='center'>
            <field.div stretch={ false } round={ exclusive }>
                { exclusive
                    ? <input.radio { ...props } ref={ ref } id={ id }/>
                    : <input.checkbox { ...props } ref={ ref } id={ id }/>
                }
            </field.div>
            { label
                ? <text.label
                    { ...{ htmlFor: id, children: label } }
                    priority='secondary' />
                : null
            }
        </box.div>
    )
});
