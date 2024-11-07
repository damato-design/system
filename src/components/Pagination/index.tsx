import { forwardRef, useCallback, useState } from "react";
import { Menu, MenuProps } from '../Menu';
import { Button } from '../Button';
import { box } from '../Box';
import { IDREF } from '../Localize';

type PaginationProps = Omit<MenuProps, 'activeDescendant' | 'onActiveDescendantChange'> & {
    index: number,
};

export const Pagination = forwardRef<HTMLElement, PaginationProps>(({
    items,
    onConfirm,
    index = 0,
    ...rest
}: PaginationProps, ref) => {
    const [activeDescendant, onActiveDescendantChange] = useState(items[index].id);

    const onButton = useCallback((ev: any) => {
        const direction = Number(ev.target.value);
        const clamp = Math.min(Math.max(index + direction, 0), items.length - 1);
        typeof onConfirm === 'function' && onConfirm(items[clamp]);
    }, [index, items]);

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
                disabled={ index === items.length - 1 }
                aria-labelledby={ IDREF.next }
                aria-label='next'
                onClick={ onButton }
                value={ 1 }/>
        </box.nav>
    )
});