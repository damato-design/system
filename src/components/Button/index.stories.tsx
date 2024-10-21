import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '.';

import { box } from '../Box';
import { text } from '../Text';

/**
 * The `<Button/>` component allows a user to take an action.
 * This is commonly used to execute some behavior on the current page
 * but may also be used to navigate to another page.
 * 
 * The presentation of buttons is mostly driven by the
 * values provided by the current mode.
 */
const meta = {
    title: 'Components/Button',
    component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: 'Click here!'
    },
}

export const Primary: Story = {
    args: {
        children: 'Most important thing to do!',
        priority: 'primary'
    }
}

export const Secondary: Story = {
    args: {
        children: 'Go to dashboard!',
        href: '#',
        behavior: 'external',
        priority: 'secondary'
    }
}

export const Icon: Story = {
    args: {
        children: 'Search',
        icon: 'search',
        priority: 'primary'
    }
}

export const Behavior: Story = {
    args: {
        children: 'Menu',
        behavior: 'menu',
        priority: 'secondary'
    }
}

export const Dismiss: Story = {
    args: {
        behavior: 'dismiss'
    }
}

export const Disabled: Story = {
    args: {
        children: 'Please do not do this',
        disabled: true
    }
}

export const Alignment: Story = {
    args: {
        priority: 'primary'
    },
    render: (args) => {
        return (
            <box.div gap inset={{ block: 'start' }}>
                <Button { ...args }>Content</Button>
                <Button { ...args } icon='anchor'>Icon</Button>
                <Button { ...args } icon='addchart' aria-label='Add Chart'/>
            </box.div>
        );
    }
}