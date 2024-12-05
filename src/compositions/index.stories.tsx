import type { Meta, StoryObj } from '@storybook/react'

import { ProductDetailsPage as PDP } from './product-details-page';
import { ProductListingPage as PLP } from './product-listing-page';
import { PricingPage as PP } from './pricing-page';

const Placeholder = () => null;

const meta = {
    title: 'Compositions/Pages',
    component: Placeholder,
    tags: ['dev', '!autodocs', 'draft'],
    parameters: {
        densityLevel: false
    }
} satisfies Meta<typeof PDP>

export default meta
type Story = StoryObj<typeof meta>

export const ProductDetailsPage: Story = {
    render: PDP
}

export const ProductListingPage: Story = {
    render: PLP
}

export const PricingPage: Story = {
    render: PP
}