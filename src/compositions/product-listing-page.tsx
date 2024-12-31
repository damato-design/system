import { box } from '../components/Box';
import { text } from '../components/Text';
import { Page } from './page';
import { ProductCards } from './product-cards';
import { CalloutBanner } from './callout-banner';

const relatedProducts = [{
    id: 1,
    subject: <text.h3 priority='primary'>Gaming Console</text.h3>,
    price: 15.99,
    src: 'https://prd.place/400?id=8',
    cta: 'View Details'
}, {
    id: 2,
    subject: <text.h3 priority='primary'>Fragrance Spray</text.h3>,
    price: 24.99,
    src: 'https://prd.place/400?id=23',
    cta: 'View Details'
}, {
    id: 3,
    subject: <text.h3 priority='primary'>Vintage Radio</text.h3>,
    price: 37.99,
    src: 'https://prd.place/400?id=38',
    cta: 'View Details'
}]

export const ProductListingPage = () => {
    return (
        <Page>
            <CalloutBanner/>
            <box.div padding />
            <box.div denser stack gap>
                <text.h2 priority='primary'>Products</text.h2>
                <ProductCards products={ relatedProducts }/>
            </box.div>
            <box.div padding />
        </Page>
    )
}
