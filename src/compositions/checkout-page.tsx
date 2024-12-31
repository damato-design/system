import { box } from '../components/Box';
import { text } from '../components/Text';
import { Page } from './page';
import { card } from '../components/Card';
import { QuantitySelector } from './quantity-selector';
import { CheckoutOptions } from './checkout-options';
import { ProductCards } from './product-cards';
import { OrderSummary } from './order-summary';

const savedProducts = [{
    id: 1,
    subject: <text.h3 priority='primary'>Gaming Console</text.h3>,
    price: 15.99,
    src: 'https://prd.place/400?id=8',
    cta: 'Add to Cart'
}, {
    id: 2,
    subject: <text.h3 priority='primary'>Fragrance Spray</text.h3>,
    price: 24.99,
    src: 'https://prd.place/400?id=23',
    cta: 'Add to Cart'
}]

export const CheckoutPage = () => {
    const product = {
        subject: <text.h2>Microphone</text.h2>,
        src: 'https://prd.place/400?id=12',
    }

    const quantityLabel = <text.label>Quantity</text.label>

    return (
        <Page stack={ false }>
            <box.div stack stretch>
                <text.h2 priority='primary'>Checkout</text.h2>
                <box.div stretch gap placeChildren='top-start' distribute='between'>
                    <card.div { ...product } maxWidth='120px' placeChildren='start'/>
                    <QuantitySelector label={ quantityLabel }/>
                    <CheckoutOptions/>
                </box.div>
                <box.div denser stack gap>
                    <text.h2 priority='primary'>Saved Items</text.h2>
                    <ProductCards products={ savedProducts }/>
                </box.div>
            </box.div>
            <box.aside>
                <OrderSummary/>
            </box.aside>
        </Page>
    );
}
