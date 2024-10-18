import { forwardRef, useCallback } from 'react';
import { box } from '../Box';
import { lockup, LockupProps } from '../Lockup';

function getIconRef(emphasis: string | undefined) {
    switch(emphasis) {
        case 'critical': 
            return 'report';
        case 'warning':
            return 'warning_amber';
        case 'success':
            return 'done';
        default:
            return 'info';
    }

}

type DialogProps = LockupProps
    & {
        emphasis?: 'critical' | 'warning' | 'success',
        modal?: boolean,
    };

export const Dialog = forwardRef<HTMLElement, DialogProps>(({
    emphasis,
    modal,
    ...props
}: DialogProps, ref) => {
    
    const Element = modal ? box.dialog : box.div;
    const showModal = useCallback(($elem: HTMLDialogElement) => {
        if (!modal) return;
        // $elem.style.setProperty('inset', 'auto');
        $elem?.showModal();
    }, [modal])

    return (
        <Element purpose='surface' ref={ showModal }>
            <div style={{ background: 'currentColor', width: '8px', flexShrink: 0 }}/>
            <lockup.div {...props} ref={ ref } icon={ getIconRef(emphasis) } padding />
        </Element>
    )
})
