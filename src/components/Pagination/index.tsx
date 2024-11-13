import { forwardRef, useCallback, useState } from "react";
import { Menu, MenuProps } from '../Menu';
import { Button } from '../Button';
import { box } from '../Box';
import { IDREF } from '../Localize';

export type { ItemProps, ItemsProps } from '../Menu';

type PaginationProps = MenuProps & {
    index: number,
    cta?: string,
};

export const Pagination = forwardRef<HTMLElement, PaginationProps>(({
    cta,
    items,
    activeDescendant,
    onActiveDescendantChange,
    onConfirm,
    index = 0,
    infill = true,
    ...rest
}: PaginationProps, ref) => {

    const onButton = useCallback((ev: any) => {
        if (typeof onConfirm !== 'function') return;
        const value = Number(ev.target.value);
        if (cta && value === 1 && index === items.length - 1) return onConfirm(null);
        const clamp = Math.min(Math.max(index + value, 0), items.length - 1);
        if (typeof onActiveDescendantChange === 'function') onActiveDescendantChange(items[clamp].id)
        onConfirm(items[clamp]);
    }, [index, items, cta]);

    return (
        <box.nav ref={ ref } gap stretch infill={ infill } distribute="between">
            <Menu
                { ...rest }
                stretch={ infill }
                activeDescendant={ activeDescendant }
                onActiveDescendantChange={ onActiveDescendantChange }
                onConfirm={ onConfirm }
                items={ items }/>
            <box.div stretch={ infill } gap placeSelf="end">
                <Button
                    icon='navigate_before'
                    disabled={ index === 0 }
                    aria-labelledby={ IDREF.previous }
                    aria-label='previous'
                    onClick={ onButton }
                    value={ -1 }/>
                <Button
                    icon='navigate_next'
                    priority={ Boolean(cta) ? 'primary' : undefined }
                    disabled={ !Boolean(cta) && index === items.length - 1 }
                    aria-labelledby={ IDREF.next }
                    aria-label='next'
                    onClick={ onButton }
                    value={ 1 }>
                    { cta }
                </Button>
            </box.div>
        </box.nav>
    )
});