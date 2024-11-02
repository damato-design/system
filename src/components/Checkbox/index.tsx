import { forwardRef, useId } from 'react';
import { field } from '../Field';
import { input, InputProps } from '../Input';
import { box } from '../Box';
import { text } from '../Text';
import { restrictProps } from '../Element';

type CheckboxProps = InputProps & {
    exclusive?: boolean,
    label?: string,
};

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(({
    exclusive,
    label,
    name,
    ...props
}, ref) => {

    const id = useId();
    const config = Object.assign({}, restrictProps(props), {
        ref, id, name
    });

    return (
        <box.div stack={ false } gap padding placeChildren='center'>
            <field.div stretch={ false } round={ exclusive } clip={ false }>
                { exclusive
                    ? <input.radio { ...config }/>
                    : <input.checkbox { ...config }/>
                }
            </field.div>
            { label
                ? <text.label { ...{ htmlFor: id, children: label } }/>
                : null
            }
        </box.div>
    )
});
