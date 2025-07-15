import { forwardRef } from 'react';
import { track, TrackProps } from '../Track';
import { box } from '../Box';
import { text } from '../Text';
import { restrictProps } from '../Element';

export type ToggleProps = TrackProps & {
    checked?: boolean,
    defaultChecked?: boolean
}

export const Toggle = forwardRef<HTMLElement, ToggleProps>(({
    checked,
    value,
    defaultChecked,
    defaultValue,
    ...props
}, ref) => {

    return (
        <track.range
            {...props}
            defaultValue={ typeof defaultChecked === 'boolean' ? Number(defaultChecked) : undefined }
            value={ typeof checked === 'boolean' ? Number(checked) : undefined }
            role='switch'
            ref={ref}
            stretch={ false }
            min={ 0 }
            max={ 1 }/>
    )
});
