import { box } from '../components/Box';
import { text } from '../components/Text';
import { lockup } from '../components/Lockup';
import { Checkbox } from '../components/Checkbox';
import { useCallback, useState } from 'react';

type OrderOptionProps = {
    selected: string,
    label: string,
    value: string,
    onChange: (ev: any) => void,
}

function OrderOption({ selected, label, value, onChange }: OrderOptionProps) {
    return (
        <Checkbox
            exclusive
            name='order'
            checked={selected === value}
            priority='auxiliary'
            label={label}
            onChange={onChange}
            value={value} />
    );
}

export const CheckoutOptions = () => {
    const orderOptions = {
        delivery: 'Delivery to my home',
        pickup: 'Pickup at closest store',
    };

    const [order, setOrder] = useState('delivery');
    const onChange = useCallback(({ target }: any) => {
        setOrder(target.value);
    }, [order]);

    return (
        <lockup.fieldset subject={<text.label>Delivery or Pickup</text.label>}>
            <box.div gap stack>
                {Object.entries(orderOptions).map(([value, label]) => (
                    <OrderOption
                        selected={order}
                        label={label}
                        value={value}
                        key={value}
                        onChange={onChange} />
                ))}
            </box.div>
        </lockup.fieldset>
    );
}
