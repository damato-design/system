import type { Meta, StoryObj } from '@storybook/react'

import { ProductDetailsPage as PDP } from '.';

const meta = {
    title: 'Compositions/Product Details Page',
    component: PDP,
} satisfies Meta<typeof PDP>

export default meta
type Story = StoryObj<typeof meta>

export const ProductDetailsPage: Story = {}
