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
    children,
    maxWidth = '200px',
    ...props
}: Product) => {
    return (
        <card.li { ...props } maxWidth={ maxWidth } purpose='surface' padding>
            <text.p>${ price }</text.p>
            { children }
            <Button priority='secondary' placeSelf='bottom-start' href={ `products/${id}` }>{ cta }</Button>
        </card.li>
    )
}