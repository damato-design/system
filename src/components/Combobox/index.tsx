import { forwardRef, useState, useRef, useCallback } from 'react';
import { input, InputProps } from '../Input';
import { listbox, ListboxProps } from '../Listbox';
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
    const [inputProps, setInputProps] = useState({});
    const [focus, setFocus] = useState(false);
    const [show, setShow] = useState(false);
    const anchorRef = useRef(null);

    const onKeyUp = useCallback((ev: any) => {
        if (typeof rest.onKeyUp === 'function') rest.onKeyUp(ev);
        if (ev.key === 'Enter' && activeDescendant) {
            ev.preventDefault();
            typeof onConfirm === 'function' && onConfirm(activeDescendant);
        }
    }, [onConfirm]);

    const onItemClick = useCallback((ev: any) => {
        typeof onConfirm === 'function' && onConfirm(ev.target.value);
    }, [onConfirm]);

    // const _items = useMemo(() => {
    //     return items.map((item) => ({ onClick: (ev: any) => {
    //         typeof item.onClick === 'function' && item.onClick(ev);
    //         onItemClick(ev);
    //     }, ...item }));
    // }, [items]);

    const anchor = (
        <field.div
            ref={ anchorRef }
            >
            <input.text
                { ...rest }
                { ...inputProps }
                value={ value }
                autoComplete='off'
                onFocus={ () => {
                    setFocus(true);
                    setShow(true);
                } }
                onBlur={ () => setFocus(false) }
                onKeyUp={ onKeyUp }
                />
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
                    behavior='menu'
                    items={ items }
                    rtl={ rtl }
                    loop={ loop }
                    getAnchorProps={ setInputProps }
                    visualFocus={ focus }
                    activeDescendant={ activeDescendant }
                    onActiveDescendantChange={ (id) => {
                        console.log('change');
                        onActiveDescendantChange(id);
                    } } />
            </box.div>
        </flyout.div>
    );

    return (
        <FlyoutProvider>
            { anchor }
            { show ? popover : null }
        </FlyoutProvider>
    )
});