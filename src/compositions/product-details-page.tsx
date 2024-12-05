import { box } from '../components/Box';
import { text } from '../components/Text';
import { card } from '../components/Card';
import { PageHeader } from './page-header';
import { ProductHeader } from './product-header';
import { ProductOptions } from './product-options';
import { ProductCards } from './product-cards';

const relatedProducts = [{
    id: 1,
    subject: <text.h2 priority='primary'>Shirt</text.h2>,
    price: 15.99,
    src: '#'
}, {
    id: 2,
    subject: <text.h2 priority='primary'>Pants</text.h2>,
    price: 24.99,
    src: '#'
}, {
    id: 3,
    subject: <text.h2 priority='primary'>Jacket</text.h2>,
    price: 37.99,
    src: '#'
}]

export const ProductDetailsPage = () => {
    const productTitle = <text.h2 priority='primary'>Socks</text.h2>;
    const productImage = 'https://loremflickr.com/1280/720';
    const productTag = 'New Item!';
    const productDescription = (
        <text.p>
            You are going to love this product!
        </text.p>
    );

    return (
        <box.div stack stretch denser>
            <PageHeader>Logo</PageHeader>
            <box.main stack stretch padding gap>
                <ProductHeader>{ productTitle }</ProductHeader>
                <box.div stretch wrap>
                    <card.div
                        stretch
                        src={ productImage }
                        passiveMessage={ productTag }>
                            { productDescription }
                    </card.div>
                    <ProductOptions/>
                </box.div>
                <ProductCards products={ relatedProducts }/>
            </box.main>
        </box.div>
    )
}