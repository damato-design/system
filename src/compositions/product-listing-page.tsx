import { box } from '../components/Box';
import { text } from '../components/Text';
import { Page } from './page';
import { ProductCards } from './product-cards';

const relatedProducts = [{
    id: 1,
    subject: <text.h3 priority='primary'>Gaming Console</text.h3>,
    price: 15.99,
    src: 'https://prd.place/400?id=8'
}, {
    id: 2,
    subject: <text.h3 priority='primary'>Fragrance Spray</text.h3>,
    price: 24.99,
    src: 'https://prd.place/400?id=23'
}, {
    id: 3,
    subject: <text.h3 priority='primary'>Vintage Radio</text.h3>,
    price: 37.99,
    src: 'https://prd.place/400?id=38'
}]

export const ProductListingPage = () => {
    return (
        <Page>
            TODO: Hero cta
            <box.div denser stack gap>
                <text.h2 priority='primary'>Products</text.h2>
                <ProductCards products={ relatedProducts }/>
            </box.div>
        </Page>
    )
}
