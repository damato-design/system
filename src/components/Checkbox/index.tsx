import { forwardRef, useId, useRef, useImperativeHandle, useEffect } from 'react';
import { field } from '../Field';
import { input, InputProps } from '../Input';
import { box } from '../Box';
import { text } from '../Text';
import { restrictProps } from '../Element';

type CheckboxProps = InputProps & {
    checked?: boolean | null,
    exclusive?: boolean,
    label?: string,
    priority?: 'primary' | 'auxiliary'
};

/**
 * Creates a `<Checkbox/>` component
 * 
 * @param {CheckboxProps} props - Component configuration object
 * @returns {ReactElement} - A checkbox component
 */
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(({
    checked = false,
    exclusive,
    label,
    name,
    priority,
    ...props
}, ref) => {

    const id = useId();
    const localRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => localRef.current!, []);
    const config = Object.assign({}, restrictProps(props), {
        ref: localRef, id, name
    });

    useEffect(() => {
      if (localRef.current) {
        localRef.current.indeterminate = checked === null;
      }
    }, [checked]);

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
