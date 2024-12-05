import { box } from '../components/Box';
import { text } from '../components/Text';
import { PageHeader } from './page-header';
import { ProductCards } from './product-cards';
import { PageFooter } from './page-footer';

const productTiers = [{
    id: 1,
    subject: <text.h2 priority='primary'>Basic</text.h2>,
    price: 15.99,
}, {
    id: 2,
    subject: <text.h2 priority='primary'>Pro</text.h2>,
    price: 24.99,
}, {
    id: 3,
    subject: <text.h2 priority='primary'>Enterprise</text.h2>,
    price: 37.99,
}]

export const PricingPage = () => {
    return (
        <box.div stack stretch denser>
            <PageHeader>Logo</PageHeader>
            <box.main stack stretch padding gap>
                <box.div denser stack gap>
                    <text.h2 priority='primary'>Membership Tiers</text.h2>
                    <ProductCards products={ productTiers }/>
                </box.div>
            </box.main>
            <PageFooter>Logo</PageFooter>
        </box.div>
    )
}
