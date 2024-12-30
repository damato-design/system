import { box } from '../components/Box';
import { ProductCard } from './product-card';

type ProductCardsProps = {
    products: typeof ProductCard[]
}

export const ProductCards = ({ products }: ProductCardsProps) => {
    return (
        <box.ul grid gap>
            { products.map((product: any) => <ProductCard {...product} key={ product.id } />) }
        </box.ul>
    )
}
