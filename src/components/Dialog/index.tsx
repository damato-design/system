import { forwardRef, useCallback } from 'react';
import { box } from '../Box';
import { lockup, LockupProps } from '../Lockup';
import { element, restrictProps } from '../Element';

/**
 * Determines the correct icon reference based on emphasis.
 * 
 * @param {String} emphasis - The kind of message
 * @returns {String} - An icon reference
 */
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

export type DialogProps = LockupProps
    & {
        emphasis?: 'critical' | 'warning' | 'success',
        disrupt?: boolean,
        onClose?: (ev: any) => void
    };

/**
 * Creates a `<Dialog/>` component
 * 
 * @param {DialogProps} props - Component configuration object
 * @returns {ReactElement} - A dialog component
 */
export const Dialog = forwardRef<HTMLElement, DialogProps>(({
    emphasis,
    disrupt,
    onClose,
    priority,
    ...props
}: DialogProps, ref) => {
    
    const Element = disrupt ? box.dialog : box.div;
    // This adds a small treatment to visually separate the lockup as a dialog
    const styles = { 
        background: 'currentColor',
        width: '8px',
        flexShrink: 0
    };

    // Use client JS to trigger visibility of the <dialog/> on the top-layer
    const showModal = useCallback(($elem: HTMLDialogElement) => {
        if (!disrupt || !$elem) return;
        $elem.style?.setProperty('margin', 'auto');
        $elem.showModal();
        document.body.setAttribute('inert', '');
        () => document.body.removeAttribute('inert');
    }, [disrupt, onClose])

    // on Esc, close the dialog
    const onKeyDown = useCallback((ev: any) => {
        if (!disrupt) return;
        if (ev.key === 'Escape') {
            ev.preventDefault();
            typeof onClose === 'function' && onClose(ev);
        }
    }, [disrupt, onClose]);

    // on pointerdown outside of the content area, close the dialog
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
