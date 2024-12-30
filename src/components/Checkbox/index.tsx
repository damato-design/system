import { forwardRef, useId } from 'react';
import { field } from '../Field';
import { input, InputProps } from '../Input';
import { box } from '../Box';
import { text } from '../Text';
import { restrictProps } from '../Element';

type CheckboxProps = InputProps & {
    exclusive?: boolean,
    label?: string,
    priority?: 'primary' | 'auxiliary' 
};

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(({
    exclusive,
    label,
    name,
    priority,
    ...props
}, ref) => {

    const id = useId();
    const config = Object.assign({}, restrictProps(props), {
        ref, id, name
    });

    return (
        <box.div stack={ false } gap placeChildren='start'>
            <field.div
                clip={ false }
                stretch={ false }
                shrink={ false }
                round={ exclusive }>
                { exclusive
                    ? <input.radio { ...config }/>
                    : <input.checkbox { ...config }/>
                }
            </field.div>
            { label
                ? <text.label { ...{ htmlFor: id, children: label, priority } }/>
                : null
            }
        </box.div>
    )
});
