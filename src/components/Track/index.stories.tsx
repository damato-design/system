import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useState } from 'react';

import { track } from '.';

/**
 * The `track` primitive helps present progress,
 * sometimes allowing user input to control the progress.
 */
const meta = {
    title: 'Primitives/track',
    component: track.progress,
} satisfies Meta<typeof track.progress>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The progress type is meant to indicate level of completion.
 * If the amount of completion is unknown, then omitting the value
 * will present the component in an indeterminate state.
 */
export const Default: Story = {
    args: {}
}

/**
 * The meter type is meant to measure a fractional amount of countable items.
 * Example: amount of available disk spac in kilobytes.
 */
export const Meter: Story = {
    args: { value: 50 },
    render: (args) => <track.meter { ...args }/> 
}

/**
 * The range type allows the user to provide the value between two thresholds.
 * This is completed by grabbing the elevated thumb and
 * dragging to an appropriate position within the track.
 * 
 * When preparing this experience fully, additional feedback signifiers
 * should be included to display the current value and thresholds.
 */
export const Range: Story = {
    args: { value: 30 },
    render: ({ value, ...args }) => {
        const [val, setValue] = useState(value);
        const onChange = useCallback((ev: any) => setValue(ev.target.valueAsNumber), []);
        return <track.range { ...args } value={ val } onChange={ onChange }/>
    } 
}