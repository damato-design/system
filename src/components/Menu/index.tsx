import { forwardRef, useState, useRef } from "react";
import { Button, ButtonProps } from "../Button"
import { listbox, ListboxProps } from "../Listbox";
import { box } from "../Box";
import { flyout } from "../Flyout";

export type MenuProps = Omit<ButtonProps & ListboxProps, 'visualFocus'>;

export const Menu = forwardRef<HTMLElement, MenuProps>(({
    activeDescendant,
    onActiveDescendantChange,
    behavior,
    items,
    rtl,
    loop,
    ...rest
}: MenuProps, ref) => {
    const [buttonProps, setButtonProps] = useState({});
    const [anchorProps, setAnchorProps] = useState({});
    const [focus, setFocus] = useState(false);
    const anchorRef = useRef(null);

    const button = (
        <Button
            { ...rest }
            { ...buttonProps }
            { ...anchorProps }
            ref={ anchorRef }
            stretch={ false }
            onFocus={ () => setFocus(true) }
            onBlur={ () => setFocus(false) }
            behavior='menu'/>
    );

    const menu = (
        <flyout.div
            behavior='menu'
            getAnchorProps={ setAnchorProps }
            stretch>
            <box.div
                stretch
                purpose='surface'
                priority='secondary'>
                <listbox.div
                    ref={ ref }
                    behavior='menu'
                    rtl={ rtl }
                    loop={ loop }
                    items={ items }
                    getAnchorProps={ setButtonProps }
                    visualFocus={ focus }
                    activeDescendant={ activeDescendant }
                    onActiveDescendantChange={ onActiveDescendantChange } />
            </box.div>
        </flyout.div>
    );

    return (
        <>
            { button }
            { menu }
        </>
    )
});