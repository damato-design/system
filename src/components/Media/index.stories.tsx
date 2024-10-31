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

/**
 * The component can display images.
 */
export const Default: Story = {
    args: {
        src: 'https://loremflickr.com/1280/720',
    }
}

/**
 * The value of the `src` will determine the type of element to render.
 */
export const Video: Story = {
    args: {
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
}

/**
 * This demonstrates what is presented when the `<Media/>`
 * is placed within a `standby` element.
 */
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
