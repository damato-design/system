import type { Meta, StoryObj } from '@storybook/react'

import { Disclosure } from '.';
import { lockup } from '../Lockup';
import { text } from '../Text';

/**
 * The `<Disclosure/>` component uses a `<details/>` and `<summary/>` internally.
 * The `<summary/>` is presented using `purpose='action'`.
 */
const meta = {
    title: 'Components/Disclosure',
    component: Disclosure,
    tags: ['draft'],
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 360,
            },
        },
    },
} satisfies Meta<typeof Disclosure>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The `subject` is the content of the `<summary/>`.
 */
export const Default: Story = {
    args: {
        subject: 'A book fell on my head',
        children: 'I only have my shelf to blame.'
    }    
}

/**
 * You can use a `lockup` in either the `subject` or the `children`.
 */
export const Lockups: Story = {
    args: {
        subject: (
            <lockup.div subject={ <text.h2 priority='primary'>
                Have you heard of Murphy's Law?
            </text.h2> }>
                Yes, anything can go wrong will go wrong.
            </lockup.div>
        ),
        children: (
            <lockup.div padding subject={ <text.h3 priority='primary'>
                What's about Cole's law?
            </text.h3> }>
                It's a thin-slice cabbage dripped in mayonnaise and sour cream.
            </lockup.div>
        )
    }  
}