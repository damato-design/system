import { forwardRef, useCallback } from 'react';
import { box } from '../Box';
import { lockup, LockupProps } from '../Lockup';
import { element, restrictProps } from '../Element';

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
        disrupt?: boolean,
        onClose?: (ev: any) => void
    };

export const Dialog = forwardRef<HTMLElement, DialogProps>(({
    emphasis,
    disrupt,
    onClose,
    priority,
    ...props
}: DialogProps, ref) => {
    
    const Element = disrupt ? box.dialog : box.div;
    const styles = { 
        background: 'currentColor',
        width: '8px',
        flexShrink: 0
    };

    const showModal = useCallback(($elem: HTMLDialogElement) => {
        if (!disrupt || !$elem) return;
        $elem.style?.setProperty('margin', 'auto');
        $elem.showModal();
        document.body.setAttribute('inert', '');
        () => document.body.removeAttribute('inert');
    }, [disrupt, onClose])

    const onKeyDown = useCallback((ev: any) => {
        if (!disrupt) return;
        if (ev.key === 'Escape') {
            ev.preventDefault();
            typeof onClose === 'function' && onClose(ev);
        }
    }, [disrupt, onClose]);

    const onPointerDown = useCallback((ev: any) => {
        if (!disrupt) return;
        if (ev.target === ev.currentTarget) {
            typeof onClose === 'function' && onClose(ev);
        }
    }, [disrupt, onClose]);

    return (
        <Element
            purpose='surface'
            priority={ priority }
            ref={ showModal }
            onKeyDown={ onKeyDown }
            onPointerDown={ onPointerDown }>
            <element.div style={ styles }/>
            <lockup.div
                {...restrictProps(props)}
                ref={ ref }
                icon={ getIconRef(emphasis) }
                padding />
        </Element>
    )
})
