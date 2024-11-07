import { forwardRef, useCallback, useState } from "react";
import { Menu, MenuProps } from '../Menu';
import { Button } from '../Button';
import { box } from '../Box';
import { IDREF } from '../Localize';

export type { ItemProps, ItemsProps } from '../Menu';

type PaginationProps = Omit<MenuProps, 'activeDescendant' | 'onActiveDescendantChange'> & {
    index: number,
    cta?: string,
};

export const Pagination = forwardRef<HTMLElement, PaginationProps>(({
    cta,
    items,
    onConfirm,
    index = 0,
    ...rest
}: PaginationProps, ref) => {
    const [activeDescendant, onActiveDescendantChange] = useState(items[index].id);

    const onButton = useCallback((ev: any) => {
        if (typeof onConfirm !== 'function') return;
        const value = Number(ev.target.value);
        if (cta && value === 1 && index === items.length - 1) return onConfirm(null);
        const clamp = Math.min(Math.max(index + value, 0), items.length - 1);
        onConfirm(items[clamp]);
    }, [index, items, cta]);

    return (
        <box.nav ref={ ref } gap stretch placeChildren='end'>
            <Menu
                { ...rest }
                activeDescendant={ activeDescendant }
                onActiveDescendantChange={ onActiveDescendantChange }
                onConfirm={ onConfirm }
                items={ items }
                placeSelf='start'/>
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
        </box.nav>
    )
});