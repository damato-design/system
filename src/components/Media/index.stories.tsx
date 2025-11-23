import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { Media, type MediaProps } from '.';
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
        checklist
    },
} satisfies Meta<MediaProps>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The component can display images.
 */
export const Default: Story = {
    args: {
        src: '/wireframe-still.jpg',
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
