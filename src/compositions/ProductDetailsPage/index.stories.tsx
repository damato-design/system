import type { Meta, StoryObj } from '@storybook/react'

import { ProductDetailsPage } from '.';

const meta = {
    title: 'Compositions/Product Details Page',
    component: ProductDetailsPage,
    tags: ['!dev']
} satisfies Meta<typeof ProductDetailsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
