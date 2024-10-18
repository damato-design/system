import { forwardRef } from 'react';
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
        emphasis?: 'critical' | 'warning' | 'success'
    };

export const Dialog = forwardRef<HTMLElement, DialogProps>(({
    emphasis,
    ...props
}: DialogProps, ref) => {
    
    const Element = box.div;
    const icon = getIconRef(emphasis);

    return (
        <Element ref={ ref } purpose='surface'>
            <div style={{ background: 'currentColor', width: '8px', flexShrink: 0 }}/>
            <lockup.div {...props} icon={ icon } padding />
        </Element>
    )
})
