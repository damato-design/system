import { forwardRef, useState, useRef } from 'react';
import { input, InputProps } from '../Input';
import { listbox, ListboxProps } from '../Listbox';
import { field, FieldProps } from '../Field';
import { box } from '../Box';
import { flyout } from '../Flyout';

type ComboBoxProps = Omit<InputProps & FieldProps & ListboxProps, 'visualFocus'>

export const Combobox = forwardRef<HTMLElement, ComboBoxProps>(({
    activeDescendant,
    onActiveDescendantChange,
    behavior,
    items,
    rtl,
    loop,
    ...rest
}: ComboBoxProps, ref) => {
    const [inputProps, setInputProps] = useState({});
    const [anchorProps, setAnchorProps] = useState({});
    const [focus, setFocus] = useState(false);
    const [show, setShow] = useState(false);
    const anchorRef = useRef(null);
    const flyoutRef = useRef(null);

    const control = (
        <field.div
            { ...anchorProps }
            ref={ anchorRef }
            >
            <input.text
                { ...rest }
                { ...inputProps }
                autoComplete='off'
                onFocus={ () => {
                    setFocus(true);
                    setShow(true);
                } }
                onBlur={ () => setFocus(false) }
                />
        </field.div>
    );

    const menu = (
        <flyout.div
            ref={ flyoutRef }
            behavior='listbox'
            getAnchorProps={ setAnchorProps }
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
                    onActiveDescendantChange={ onActiveDescendantChange } />
            </box.div>
        </flyout.div>
    );

    return (
        <>
            { control }
            { show ? menu : null }
        </>
    )
});