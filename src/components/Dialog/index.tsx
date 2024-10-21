import { forwardRef, useCallback, useEffect } from 'react';
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
        onClose?: (ev: any) => void
    };

export const Dialog = forwardRef<HTMLElement, DialogProps>(({
    emphasis,
    modal,
    onClose,
    priority,
    ...props
}: DialogProps, ref) => {
    
    const Element = modal ? box.dialog : box.div;
    const styles = { 
        background: 'currentColor',
        width: '8px',
        flexShrink: 0
    };

    const showModal = useCallback(($elem: HTMLDialogElement) => {
        if (!modal || !$elem) return;
        $elem.style?.setProperty('margin', 'auto');
        $elem.showModal();
        document.body.setAttribute('inert', '');
        () => document.body.removeAttribute('inert');
    }, [modal, onClose])

    const onKeyDown = useCallback((ev: any) => {
        if (!modal) return;
        if (ev.key === 'Escape') {
            ev.preventDefault();
            typeof onClose === 'function' && onClose(ev);
        }
    }, [modal, onClose]);

    const onPointerDown = useCallback((ev: any) => {
        if (!modal) return;
        if (ev.target === ev.currentTarget) {
            typeof onClose === 'function' && onClose(ev);
        }
    }, [modal, onClose]);

    return (
        <Element
            purpose='surface'
            priority={ priority }
            ref={ showModal }
            onKeyDown={ onKeyDown }
            onPointerDown={ onPointerDown }>
            <div style={ styles }/>
            <lockup.div
                {...props}
                ref={ ref }
                icon={ getIconRef(emphasis) }
                padding />
        </Element>
    )
})
