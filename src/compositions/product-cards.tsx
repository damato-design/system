import { box } from '../components/Box';
import { card, CardProps } from '../components/Card';
import { text } from '../components/Text';
import { Button } from '../components/Button';

type Product = CardProps & {
    price: number,
    id: string,
}

type ProductCardsProps = {
    products: Product[]
}

function ProductCard({
    price,
    id,
    ...props
}: Product) {
    return (
        <card.li { ...props } purpose='surface' padding placeChildren='start'>
            <text.p>${ price }</text.p>
            <Button priority='secondary' href={ `products/${id}` }>Details</Button>
        </card.li>
    )
}

export const ProductCards = ({ products }: ProductCardsProps) => {
    return (
        <box.ul grid denser>
            { products.map((product: Product) => <ProductCard {...product} key={ product.id } />) }
        </box.ul>
    )
}
