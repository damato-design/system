import { forwardRef, useCallback } from 'react';
import clsx from 'clsx';
import css from './styles.module.scss';
import { Button, ButtonProps } from '../Button';
import { restrictProps } from '../Element';

export type CloseProps = ButtonProps & {
    float?: boolean
}

export const Close = forwardRef<HTMLElement, CloseProps>(({
    float = true,
    ...props
}: CloseProps, ref) => {

    const resize = useCallback(($elem: HTMLDivElement) => {
        const { firstElementChild } = $elem;
        $elem.style.width = firstElementChild!.clientWidth + 'px';
    }, []);

    return (
        <div className={ clsx(css.close, { [css.float]: float }) } ref={ resize }>
            <Button { ...restrictProps(props) } ref={ ref } behavior='dismiss' />
        </div>
    )
})