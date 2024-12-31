import { useState, ReactNode } from 'react';
import { Menu, ItemsProps } from '../components/Menu';

const links = {
    Categories: '#',
    Deals: '#',
    'New & Featured': '#',
    'Pickup & Delivery': '#'
};

export const SiteMenu = ({ label }: { label?: ReactNode }) => {
    const items = Object.entries(links).map(([label, url], i) => ({
        id: `link-${i}`,
        children: label,
        href: url
    })) as ItemsProps;

    const [active, setActive] = useState(items[0].id);

    return (
        <Menu
            icon='menu'
            items={ items }
            activeDescendant={ active }
            onActiveDescendantChange={ setActive }>{ label }</Menu>
    )
}