import { useState, useCallback } from 'react';
import { field } from '../components/Field';
import { Button } from '../components/Button';
import { input } from '../components/Input';
import { lockup } from '../components/Lockup';

export const QuantitySelector = ({ label }: any) => {
    const [value, setValue] = useState(1);

    const onClick = useCallback((ev: any) => {
        setValue((val) => val + Number(ev.target.value));
    }, []);

    const onChange = useCallback((ev: any) => {
        setValue(ev.target.value);
    }, []);

    return (
        <lockup.div subject={ label }>
            <field.div stretch={ false }>
                <Button icon='remove' aria-label='Decrement' value={-1} onClick={onClick} />
                <input.number name='number' value={value} onChange={onChange} fieldSizing='content' />
                <Button icon='add' aria-label='Increment' value={1} onClick={onClick} />
            </field.div>
        </lockup.div>
    )
}