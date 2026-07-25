import { box } from '../components/Box';
import { Intrinsic } from '../components/Element';
import { text } from '../components/Text';
import { lockup } from '../components/Lockup';
import { Checkbox } from '../components/Checkbox';
import { Button } from '../components/Button';
import { useCallback, useState } from 'react';

// A `box.form` typed to also accept native form attributes such as `action`.
const Form = box.form as Intrinsic<typeof box.form, 'form'>;

type SizeOptionProps = {
    size: string,
    label: string,
    value: string,
    onChange: (ev: any) => void,
}

function SizeOption({ size, label, value, onChange }: SizeOptionProps) {
    return (
        <Checkbox
            exclusive
            name='size'
            checked={ size === value }
            label={ label }
            onChange={ onChange }
            value={ value } />
    );
}

export const ProductOptions = () => {
    const sizes = {
        small: 'sm',
        medium: 'md',
        large: 'lg'
    };

    const [size, setSize] = useState(sizes.medium);
    const onChange = useCallback(({ target }: any) => {
        setSize(target.value);
    }, [size]);

    return (
        <Form
            action=''
            stack
            padding
            gap
            shrink={ false }
            purpose='surface'>
            <lockup.fieldset subject={ <text.label>Select size</text.label> }>
                <box.div gap stack>
                    { Object.entries(sizes).map(([label, value]) => (
                        <SizeOption
                            label={ label }
                            size={ size }
                            value={ value }
                            key={ value }
                            onChange={ onChange }/>
                    )) }
                </box.div>
            </lockup.fieldset>
            <Button priority='primary' icon='add_shopping_cart'>Add to cart</Button>
        </Form>
    );
}
