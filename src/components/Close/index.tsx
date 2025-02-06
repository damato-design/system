import { forwardRef } from 'react';
import clsx from 'clsx';
import css from './styles.module.scss';
import { Button, ButtonProps } from '../Button';
import { restrictProps } from '../Element';

export type CloseProps = ButtonProps & {
    float?: boolean
}

/**
 * Creates a `<Close/>` component
 * 
 * @param {CloseProps} props - Component configuration object
 * @returns {ReactElement} - A close button component
 */
export const Close = forwardRef<HTMLElement, CloseProps>(({
    float = true,
    ...props
}: CloseProps, ref) => {

    return (
        <div className={ clsx(css.close, { [css.float]: float }) }>
            <Button { ...restrictProps(props) } ref={ ref } behavior='dismiss' />
        </div>
    )
})