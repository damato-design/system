import { forwardRef, useCallback, useState, useMemo } from 'react';
import { input, InputProps } from '../Input';
import { listbox, ListboxProps, ListboxProvider } from '../Listbox';
import { field, FieldProps } from '../Field';
import { box } from '../Box';
import { flyout, FlyoutProvider } from '../Flyout';

export type { ItemProps, ItemsProps } from '../Listbox';

export type ComboBoxProps = Omit<InputProps & FieldProps & ListboxProps, 'visualFocus'> & {
    onConfirm?: (value: any) => void;
}

/**
 * Creates a `<Comboxbox/>` component
 * 
 * @param {ComboBoxProps} props - Component configuration object
 * @returns {ReactElement} - A combobox component
 */
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

    // Determine the active descendent as item
    const item = useMemo(() => {
        return items.find((item) => item.id === activeDescendant);
    }, [items, activeDescendant]);

    // Hide the flyout when confirming selection
    const _onConfirm = useCallback(() => {
        if (show && typeof onConfirm === 'function') onConfirm(item);
        setShow(!show);
    }, [item, onConfirm, show]);

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