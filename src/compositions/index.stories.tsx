import type { Meta, StoryObj } from '@storybook/react'

import { ProductDetailsPage } from './product-details-page';
import { ProductListingPage } from './product-listing-page';
import { PricingPage } from './pricing-page';

const Placeholder = () => null;

const meta = {
    title: 'Compositions/Pages',
    component: Placeholder,
    tags: ['dev', '!autodocs', 'draft'],
    parameters: {
        densityLevel: false
    }
} satisfies Meta<typeof Placeholder>

export default meta
type Story = StoryObj<typeof meta>

export const ProductDetails: Story = {
    render: ProductDetailsPage
}

export const ProductListing: Story = {
    render: ProductListingPage
}

export const Pricing: Story = {
    render: PricingPage
}