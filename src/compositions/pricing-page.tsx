import { box } from '../components/Box';
import { text } from '../components/Text';
import { Page } from './page';
import { ProductCards } from './product-cards';

const productTiers = [{
    id: 1,
    subject: <text.h3 priority='primary'>Basic</text.h3>,
    price: 15.99,
    cta: 'Choose plan'
}, {
    id: 2,
    subject: <text.h3 priority='primary'>Pro</text.h3>,
    price: 24.99,
    cta: 'Choose plan'
}, {
    id: 3,
    subject: <text.h3 priority='primary'>Enterprise</text.h3>,
    price: 37.99,
    cta: 'Choose plan'
}]

export const PricingPage = () => {
    return (
        <Page>
             <box.div denser stack gap>
                <text.h2 priority='primary'>Membership Tiers</text.h2>
                <ProductCards products={ productTiers }/>
            </box.div>
        </Page>
    )
}
