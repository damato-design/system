import { forwardRef, useState, useRef, useEffect } from 'react';
import { input, InputProps } from '../Input';
import { listbox, ListboxProps } from '../Listbox';
import { field, FieldProps } from '../Field';
import { box } from '../Box';
import { flyout } from '../Flyout';

type ComboBoxProps = Omit<InputProps & FieldProps & ListboxProps, 'visualFocus'> & {
    show?: boolean
};

export const Combobox = forwardRef<HTMLElement, ComboBoxProps>(({
    activeDescendant,
    onActiveDescendantChange,
    behavior,
    items,
    rtl,
    loop,
    show,
    ...rest
}: ComboBoxProps, ref) => {
    const [inputProps, setInputProps] = useState({});
    const [anchorProps, setAnchorProps] = useState({});
    const [focus, setFocus] = useState(false);
    const anchorRef = useRef(null);
    const flyoutRef = useRef(null);

    useEffect(() => {
        if (!flyoutRef?.current) return;
        if (show) {
            flyoutRef.current.showPopover();
        } else {
            flyoutRef.current.hidePopover();
        }
    }, [show]);

    const control = (
        <field.div
            { ...anchorProps }
            ref={ anchorRef }
            >
            <input.text
                { ...rest }
                { ...inputProps }
                autoComplete='off'
                onFocus={ () => setFocus(true) }
                onBlur={ () => setFocus(false) }
                />
        </field.div>
    );

    const menu = (
        <flyout.div
            ref={ flyoutRef }
            behavior='listbox'
            disclosure='manual'
            getAnchorProps={ setAnchorProps }
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
            { menu }
        </>
    )
});