import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import Box from './';

const meta = {
    title: 'Components/Box',
    component: Box,

} satisfies Meta<typeof Box>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Hello World!'
    }
}