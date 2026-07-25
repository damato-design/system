import { forwardRef, useCallback, useState, useMemo, useRef, useLayoutEffect } from 'react';
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
    const popoverRef = useRef<HTMLElement>(null);

    // The input opens the listbox as the user types — a non-button trigger, so
    // the popover has no declarative command and is shown/hidden imperatively.
    useLayoutEffect(() => {
        const $popover = popoverRef.current;
        if (!$popover) return;
        const isOpen = $popover.matches(':popover-open');
        if (show && !isOpen) $popover.showPopover();
        if (!show && isOpen) $popover.hidePopover();
    }, [show]);

    // Determine the active descendent as item
    const item = useMemo(() => {
        return items.find((item) => item.id === activeDescendant);
    }, [items, activeDescendant]);

    // Choosing an item commits it as the value and always closes the menu.
    const _onConfirm = useCallback(() => {
        if (typeof onConfirm === 'function') onConfirm(item);
        setShow(false);
    }, [item, onConfirm]);

    const anchor = (
        <field.div>
            <input.text
                { ...rest }
                value={ value }
                autoComplete='off'
                // Typing filters (via the consumer's value) and keeps the menu
                // open so the narrowed options are visible.
                onInput={ () => setShow(true) }
                onKeyDown={ (ev: any) => ev.key === 'Enter' && _onConfirm() }/>
        </field.div>
    )

    const popover = (
        <flyout.div
            ref={ popoverRef }
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
                { popover }
            </ListboxProvider>
        </FlyoutProvider>
    )
});