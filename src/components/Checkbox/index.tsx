import { forwardRef } from 'react';
import { field } from '../Field';
import { input, InputProps } from '../Input';

type CheckboxProps = InputProps & {
    name: string,
    exclusive?: boolean
};

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(({
    exclusive,
    ...props
}, ref) => {
    // TODO: needs focus-within approach
    return (
        <field.div stretch={ false } round={ exclusive }>
            { exclusive
                ? <input.radio { ...props } ref={ ref }/>
                : <input.checkbox { ...props } ref={ ref }/>
            }
        </field.div>
    )
});
