import { forwardRef } from "react";
import { Menu, MenuProps } from '../Menu';
import { Button } from '../Button';
import { box } from '../Box';
import { IDREF } from '../Localize';

type PaginationProps = MenuProps & {
    onClick: (ev: any) => void
};

export const Pagination = forwardRef<HTMLElement, PaginationProps>(({
    onClick,
    ...rest
}: PaginationProps, ref) => {
    return (
        <box.nav ref={ ref } gap stretch placeChildren='end'>
            <Menu { ...rest } placeSelf='start' />
            <Button
                icon='navigate_before'
                aria-labelledby={ IDREF.previous }
                aria-label='previous'
                onClick={ onClick }
                value={ -1 }/>
            <Button
                icon='navigate_next'
                aria-labelledby={ IDREF.next }
                aria-label='next'
                onClick={ onClick }
                value={ 1 }/>
        </box.nav>
    )
});