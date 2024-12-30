import type { Meta, StoryObj } from '@storybook/react'

import { ProductDetailsPage } from './product-details-page';
import { ProductListingPage } from './product-listing-page';
import { PricingPage } from './pricing-page';
import { CheckoutPage } from './checkout-page';

const Placeholder = () => null;

const meta = {
    title: 'Compositions/Pages',
    component: Placeholder,
    tags: ['dev', '!autodocs', 'draft'],
    parameters: {
        densityLevel: false,
        layout: 'fullscreen',
    }
} satisfies Meta<typeof Placeholder>

export default meta
type Story = StoryObj<typeof meta>


export const ProductListing: Story = {
    render: ProductListingPage
}

export const ProductDetails: Story = {
    render: ProductDetailsPage
}

export const Pricing: Story = {
    render: PricingPage
}

export const Checkout: Story = {
    render: CheckoutPage
}
