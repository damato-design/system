import { forwardRef, useCallback, useState } from 'react';
import { input, InputProps } from '../Input';
import { listbox, ListboxProps, ListboxProvider } from '../Listbox';
import { field, FieldProps } from '../Field';
import { box } from '../Box';
import { flyout, FlyoutProvider } from '../Flyout';

type ComboBoxProps = Omit<InputProps & FieldProps & ListboxProps, 'visualFocus'> & {
    onConfirm?: (str: string | undefined) => void;
}

export const Combobox = forwardRef<HTMLElement, ComboBoxProps>(({
    activeDescendant,
    onActiveDescendantChange,
    behavior,
    items,
    rtl,
    loop,
    value,
    onConfirm,
    ...rest
}: ComboBoxProps, ref) => {
    const [show, setShow] = useState(false);

    const _onConfirm = useCallback(() => {
        if (!activeDescendant || typeof onConfirm !== 'function') return;
        onConfirm(activeDescendant)
        setShow(false);
    }, [activeDescendant, onConfirm]);

    const anchor = (
        <field.div>
            <input.text
                { ...rest }
                value={ value }
                autoComplete='off'
                onInput={ () => setShow(Boolean(value)) }
                onKeyDown={ (ev: any) => ev.key === 'Enter' && _onConfirm() }/>
        </field.div>
    )

    const popover = (
        <flyout.div
            behavior='listbox'
            onClose={ () => setShow(false) }
            stretch>
            <box.div
                stretch
                purpose='surface'
                priority='secondary'>
                <listbox.div
                    ref={ ref }
                    onPointerUp={ () => _onConfirm() }
                    behavior='menu'
                    items={ items }
                    rtl={ rtl }
                    loop={ loop }
                    visualFocus={ true }
                    activeDescendant={ activeDescendant }
                    onActiveDescendantChange={ onActiveDescendantChange } />
            </box.div>
        </flyout.div>
    );

    return (
        <FlyoutProvider>
            <ListboxProvider>
                { anchor }
                { show ? popover : null }
            </ListboxProvider>
        </FlyoutProvider>
    )
});