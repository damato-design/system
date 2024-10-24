import type { Meta, StoryObj } from '@storybook/react'

import { Media } from '.';
import { box } from '../Box';

/**
 * This primitive helps in managing media sources.
 */
const meta = {
    title: 'Primitives/Media',
    component: Media,
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 460,
            },
        },
    },
} satisfies Meta<typeof Media>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        src: 'https://loremflickr.com/1280/720',
    }
}

export const Video: Story = {
    args: {
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
}

export const Loading: Story = {
    args: {
        src: '#'
    },
    render: (args) => (
        <box.div standby>
            <Media { ...args }/>
        </box.div>
    )
}
