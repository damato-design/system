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

    // Open on the top-layer. A modal <dialog/> natively inerts the rest of the
    // document, traps focus and closes on Esc, so we only need a ref to call
    // showModal() — no manual inert or keyboard handling.
    const showModal = useCallback(($elem: HTMLDialogElement) => {
        if (!disrupt || !$elem) return;
        $elem.style?.setProperty('margin', 'auto');
        $elem.showModal();
    }, [disrupt])

    // Esc fires a cancelable native `cancel` event. Prevent the default close
    // so the consumer decides whether to dismiss, and report it via onClose.
    const onCancel = useCallback((ev: any) => {
        if (!disrupt) return;
        ev.preventDefault();
        typeof onClose === 'function' && onClose(ev);
    }, [disrupt, onClose]);

    // A pointerdown on the backdrop (the dialog element itself) also reports.
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
            onCancel={ onCancel }
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
