import { box } from '../components/Box';
import { text } from '../components/Text';
import { PageHeader } from './page-header';
import { ProductCards } from './product-cards';
import { PageFooter } from './page-footer';

const relatedProducts = [{
    id: 1,
    subject: <text.h2 priority='primary'>Gaming Console</text.h2>,
    price: 15.99,
    src: 'https://prd.place/400?id=8'
}, {
    id: 2,
    subject: <text.h2 priority='primary'>Fragrance Spray</text.h2>,
    price: 24.99,
    src: 'https://prd.place/400?id=23'
}, {
    id: 3,
    subject: <text.h2 priority='primary'>Vintage Radio</text.h2>,
    price: 37.99,
    src: 'https://prd.place/400?id=38'
}]

export const ProductListingPage = () => {
    return (
        <box.div stack stretch denser>
            <PageHeader>Logo</PageHeader>
            <box.main stack stretch padding gap>
                TODO: Hero cta
                <box.div denser stack gap>
                    <text.h2 priority='primary'>Products</text.h2>
                    <ProductCards products={ relatedProducts }/>
                </box.div>
            </box.main>
            <PageFooter>Logo</PageFooter>
        </box.div>
    )
}
