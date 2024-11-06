import { forwardRef, useState, useRef } from "react";
import { Button, ButtonProps } from "../Button"
import { listbox, ListboxProps, ListboxProvider } from "../Listbox";
import { box } from "../Box";
import { flyout, FlyoutProvider } from "../Flyout";

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
    const [focus, setFocus] = useState(false);
    const [show, setShow] = useState(false);
    const anchorRef = useRef(null);

    const button = (
        <Button
            { ...rest }
            ref={ anchorRef }
            stretch={ false }
            onFocus={ () => setFocus(true) }
            onBlur={ () => setFocus(false) }
            onClick={ () => setShow(!show) }
            behavior='menu'/>
    );

    const menu = (
        <flyout.div
            behavior='menu'
            onClose={ () => setShow(false) }
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
                    visualFocus={ focus }
                    activeDescendant={ activeDescendant }
                    onActiveDescendantChange={ onActiveDescendantChange } />
            </box.div>
        </flyout.div>
    );

    return (
        <FlyoutProvider>
            <ListboxProvider>
                { button }
                { show ? menu : null }
            </ListboxProvider>
        </FlyoutProvider>
    )
});