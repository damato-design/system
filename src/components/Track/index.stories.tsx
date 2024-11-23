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
 * Example: amount of available disk space in kilobytes.
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

const items = Array.from({ length: 6 }, (_, idx) => {
    return { value: idx * 20, label: `${idx * 20}` }
});

/**
 * You can provide an `items` array of objects that represent
 * `<option/>` element attributes to display as tick marks below
 * the component. Note that in smaller screen sizes showing many tick
 * marks will be inappropriate as markings will visually collide.
 * 
 * When supplying `items`, the track will be shorter than without.
 * This is to provide enough room for the labels while center aligning
 * with the appropriate area of the track.
 * 
 * This example includes the `step` configuration so the thumb and
 * value are locked to increments of `20` to illustrate the marks clearly.
 */
export const Marks: Story = {
    args: { value: 40, items, step: 20 },
    render: ({ value, ...args }) => {
        const [val, setValue] = useState(value);
        const onChange = useCallback((ev: any) => setValue(ev.target.valueAsNumber), []);
        return <track.range { ...args } value={ val } onChange={ onChange }/>
    } 
}