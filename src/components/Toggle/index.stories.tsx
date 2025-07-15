import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { Toggle } from '.';

/**
 * The `<Toggle/>` component is a control that immediately causes a boolean change in an experience. This differs from the `<Checkbox/>` which must be confirmed _after_ making the change.
 */
const meta = {
    title: 'Components/Toggle',
    component: Toggle,
    parameters: {
        checklist
    }
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The default component looks like a smaller `track`, because it uses the component internally. However, the sliding behavior is replaced with a clicking behavior.
 */
export const Default: Story = {
    args: {}
}
