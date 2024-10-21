import { forwardRef } from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { Button, ButtonProps } from '../Button';

export type CloseProps = ButtonProps & {
    float?: boolean
}

export const Close = forwardRef<HTMLElement, CloseProps>(({
    float = true,
    ...props
}: CloseProps, ref) => {
    return (
        <div className={ clsx(css.close, { [css.float]: float }) }>
            <Button { ...props } ref={ ref } behavior='exit' />
        </div>
    )
})