import { ReactNode, useState } from 'react';
import { box } from '../components/Box';
import { Button } from '../components/Button';
import { Menu, ItemsProps } from '../components/Menu';

type ProductHeaderProps = {
    children: ReactNode
}

const items = [{
    children: 'My list',
    id: 'my-list',
    value: 'my-list'
}];

export const ProductHeader = ({ children }: ProductHeaderProps) => {
    const [activeDescendant, onActiveDescendantChange] = useState(items[0].id);
    const [favorite, setFavorite] = useState(false);
    const heart = favorite ? 'favorite' : 'favorite_border';
    return (
        <box.div gap>
            { children }
            <box.div placeSelf='end' gap denser>
                <Button icon={ heart } onClick={ () => setFavorite(!favorite) }>Favorite</Button>
                <Menu
                    activeDescendant={ activeDescendant }
                    onActiveDescendantChange={ onActiveDescendantChange }
                    items={ items as ItemsProps }>
                    Add to Wishlist
                </Menu>
            </box.div>
        </box.div>
    )
}
