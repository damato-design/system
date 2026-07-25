import { forwardRef, useState, useRef, useCallback, useMemo } from 'react';
import { Button, ButtonProps } from '../Button'
import { listbox, ListboxProps, ListboxProvider } from '../Listbox';
import { box } from '../Box';
import { flyout, FlyoutProvider } from '../Flyout';

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
    const popoverRef = useRef<HTMLElement>(null);

    const item = useMemo(() => {
        return items.find((item) => item.id === activeDescendant);
    }, [items, activeDescendant]);

    // The popover is the source of truth for open state — the button toggles it
    // via its `toggle-popover` command. We hold a ref to it so confirming can
    // close it in one step.
    const _onConfirm = useCallback(() => {
        if (typeof onConfirm === 'function') onConfirm(item);
        popoverRef.current?.hidePopover();
    }, [item, onConfirm]);

    const button = (
        <Button
            { ...rest }
            onFocus={ () => setFocus(true) }
            onBlur={ () => setFocus(false) }
            // While open, Enter confirms the active item rather than letting the
            // command toggle the popover closed.
            onKeyDown={ (ev: any) => {
                if (ev.key === 'Enter' && popoverRef.current?.matches(':popover-open')) {
                    ev.preventDefault();
                    _onConfirm();
                }
            } }
            behavior='menu'/>
    );

    const menu = (
        <flyout.div
            ref={ popoverRef }
            behavior='menu'
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
                { menu }
            </ListboxProvider>
        </FlyoutProvider>
    )
});