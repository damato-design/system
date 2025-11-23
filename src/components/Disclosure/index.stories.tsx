import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { Disclosure, type DisclosureProps } from '.';
import { lockup } from '../Lockup';
import { text } from '../Text';

/**
 * The `<Disclosure/>` component uses a `<details/>` and `<summary/>` internally.
 * The `<summary/>` is presented using `purpose='action'`.
 */
const meta = {
    title: 'Components/Disclosure',
    component: Disclosure,
    parameters: {
        docs: {
            story: {
                inline: false,
                iframeHeight: 360,
            },
        },
        checklist
    },
} satisfies Meta<DisclosureProps>

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
 * 
 * > #### Why are the headings the same size?
 * >
 * > The size of the `text` depends on the density of the container.
 * > Update the `mode` for the element to reduce the density. For
 * > more about density see the [Density docs](/docs/foundations-density--docs).
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

/**
 * Using a shared `name` across `<Disclosure/>` components will
 * make their behavior exclusive; only one will be open at a time.
 */
export const Accordion: Story = {
    args: {
        subject: ''
    },
    render: ({ subject, ...args }) => {
        return (
            <>
                <Disclosure { ...args} subject='item 1' name='accordion'>
                    This is first
                </Disclosure>
                <Disclosure { ...args} subject='item 2' name='accordion'>
                    This is second
                </Disclosure>
                <Disclosure { ...args} subject='item 3' name='accordion'>
                    This is third
                </Disclosure>
            </>
        )
    }
}