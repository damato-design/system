import { card, CardProps } from '../components/Card';
import { text } from '../components/Text';
import { Button } from '../components/Button';

// `id` is a data field here (used for keys and links), not the element's HTML
// `id`, so it's omitted from `CardProps` to allow a numeric identifier.
export type Product = Omit<CardProps, 'id'> & {
    price: string | number,
    id: string | number,
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
            <Button priority='secondary' placeSelf='bottom' href={ `products/${id}` }>{ cta }</Button>
        </card.li>
    )
}