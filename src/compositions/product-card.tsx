import { card, CardProps } from '../components/Card';
import { text } from '../components/Text';
import { Button } from '../components/Button';

type Product = CardProps & {
    price: number,
    id: string,
    cta: string,
}

export const ProductCard = ({
    id,
    price,
    cta,
    ...props
}: Product) => {
    return (
        <card.li { ...props } purpose='surface' padding>
            <text.p>${ price }</text.p>
            <Button priority='secondary' href={ `products/${id}` }>{ cta }</Button>
        </card.li>
    )
}