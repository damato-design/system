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

export const Default: Story = {
    args: {}
}

export const Meter: Story = {
    args: { value: 50 },
    render: (args) => <track.meter { ...args }/> 
}

export const Range: Story = {
    args: { value: 30 },
    render: ({ value, ...args }) => {
        const [val, setValue] = useState(value);
        const onChange = useCallback((ev: any) => setValue(ev.target.valueAsNumber), []);
        return <track.range { ...args } value={ val } onChange={ onChange }/>
    } 
}