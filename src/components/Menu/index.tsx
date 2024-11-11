import { forwardRef, useState, useRef, useCallback, useMemo, act } from "react";
import { Button, ButtonProps } from "../Button"
import { listbox, ListboxProps, ListboxProvider } from "../Listbox";
import { box } from "../Box";
import { flyout, FlyoutProvider } from "../Flyout";

export type { ItemProps, ItemsProps } from '../Listbox';

export type MenuProps = Omit<ButtonProps & ListboxProps, 'visualFocus'> & {
    onConfirm?: (value: any) => void;
};

export const Menu = forwardRef<HTMLElement, MenuProps>(({
    activeDescendant,
    onActiveDescendantChange,
    behavior,
    items,
    rtl,
    loop,
    onConfirm,
    ...rest
}: MenuProps, ref) => {
    const [focus, setFocus] = useState(false);
    const [show, setShow] = useState(false);
    const anchorRef = useRef(null);

    const item = useMemo(() => {
        return items.find((item) => item.id === activeDescendant);
    }, [items, activeDescendant]);

    const _onConfirm = useCallback(() => {
        if (show && typeof onConfirm === 'function') onConfirm(item);
        setShow(!show);
    }, [item, onConfirm, show]);

    const button = (
        <Button
            { ...rest }
            ref={ anchorRef }
            onFocus={ () => setFocus(true) }
            onBlur={ () => {
                setFocus(false);
                // TODO: Need a way to check if menu item selected after blur
                // requestAnimationFrame(() => setShow(false))
            } }
            onKeyDown={ (ev: any) => ev.key === 'Enter' && _onConfirm() }
            onPointerDown={ () => setShow(!show) }
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
                    onPointerUp={ () => _onConfirm() }
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
            <ListboxProvider behavior='menu'>
                { button }
                { show ? menu : null }
            </ListboxProvider>
        </FlyoutProvider>
    )
});