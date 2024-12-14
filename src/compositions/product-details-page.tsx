import { box } from '../components/Box';
import { text } from '../components/Text';
import { card } from '../components/Card';
import { Page } from './page';
import { ProductHeader } from './product-header';
import { ProductOptions } from './product-options';
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

export const ProductDetailsPage = () => {
    const productTitle = <text.h2 priority='primary'>Microphone</text.h2>;
    const productImage = 'https://prd.place/400?id=12';
    const productTag = 'New Item!';
    const productDescription = (
        <text.p>
            Discover the perfect blend of functionality and style
            with this versatile product. Designed with durability
            and ease of use in mind, it adapts seamlessly to your daily
            needs while maintaining a sleek and modern look.
            Whether for home, work, or travel, it’s the ideal solution
            for enhancing convenience and elevating your experience.
        </text.p>
    );

    return (
        <Page>
            <ProductHeader>{ productTitle }</ProductHeader>
            <box.div stretch gap placeChildren='top' grid distribute='between'>
                <card.div
                    span={ 2 }
                    stretch
                    src={ productImage }
                    passiveMessage={ productTag }>
                        { productDescription }
                </card.div>
                <ProductOptions/>
            </box.div>
            <box.div denser stack gap>
                <text.h2 priority='primary'>Related Products</text.h2>
                <ProductCards products={ relatedProducts }/>
            </box.div>
        </Page>
    )
}