import { box, BoxProps } from '../components/Box';
import { ProductCard, Product } from './product-card';

type ProductCardsProps = BoxProps & {
    products: Product[]
}

export const ProductCards = ({ products, ...props }: ProductCardsProps) => {
    return (
        <box.ul { ...props } gap>
            { products.map((product) => <ProductCard {...product} key={ product.id } />) }
        </box.ul>
    )
}
