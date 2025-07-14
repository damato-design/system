import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useState } from 'react';
import checklist from './checklist.md?raw';

import { track } from '.';

import { box } from '../Box';
import { text } from '../Text';

/**
 * The `track` primitive helps present progress,
 * sometimes allowing user input to control the progress.
 * 
 * Note, this is the most incomplete component in the system and still under active development. As such, expect areas of exploration to exist.
 */
const meta = {
    title: 'Primitives/track',
    component: track.progress,
    parameters: {
        checklist
    }
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
 * 
 * This also demonstrates the expected alignment if the elements are composed inline. The `track` is shown to be half the line-height of the text. The remaining space completes the line-height size.
 * 
 * This composition is _not_ advised because the output could be misunderstood to be a label. Instead, the label and output should appear above the track. This example is only presented to show the relationship between the track and text. Yes, this composition is used for the density slider to make it unobtrusive to the example.
 */
export const Meter: Story = {
    args: { value: 50 },
    render: (args) => (
        <box.div gap>
            <text.label>Battery</text.label>
            <track.meter { ...args }/>
            <text.output>50%</text.output>
        </box.div>
    ) 
}

/**
 * The range type allows the user to provide the value between two thresholds.
 * This is completed by grabbing the elevated thumb and
 * dragging to an appropriate position within the track.
 * 
 * 
 * > #### Why can't I drag the thumb?
 * >
 * > This is an artifact of a complex React ecosystem. There is a full re-render occurring after the value updates. This isn't performant and needs to be revisited for improvement. The value can be updated by clicking the location where the thumb should move.
 * 
 * This example shows a proper composition of label and output. The thumb element is the size of the text line-height.
 * 
 * > #### Shouldn't this use the lockup?
 * >
 * > Yes, to keep consistency, the `lockup` component would be more appropriate to host labels and controls. However, due to the expected placement of the `<output/>` element, it is not currently supported in the composition.
 */
export const Range: Story = {
    args: { value: 30 },
    render: ({ value, ...args }) => {
        const [val, setValue] = useState(value);
        const onChange = useCallback((ev: any) => setValue(ev.target.valueAsNumber), []);
        return (
            <box.fieldset stack stretch>
                <box.div gap distribute='between'>
                    <text.label>Battery</text.label>
                    <text.output>{ val }%</text.output>
                </box.div>
                <track.range { ...args } value={ val } onChange={ onChange }/>
            </box.fieldset>
        )
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