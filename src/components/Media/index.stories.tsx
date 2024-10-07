import type { Meta, StoryObj } from '@storybook/react'

import { Media } from '.';

/**
 * This primitive helps in managing media sources.
 *  
 * Note that this is the only primitive that has no variation for the HTML element.
 * This is because the type of element is inferred by the given `src` and its MIME type.
 */
const meta = {
    title: 'Primitives/Media',
    component: Media,
} satisfies Meta<typeof Media>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The most common use is the `<Media/>` element which creates an `<img/>` element.
 * The `src` attribute is required.
 */
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
