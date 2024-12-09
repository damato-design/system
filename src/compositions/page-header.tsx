import { box } from '../components/Box';
import { text } from '../components/Text';
import { BrandSwitcher } from './brand-switcher';

export const PageHeader = () => {
    const links = {
        Home: '#',
        Shop: '#',
        Cart: '#'
    };

    return (
        <box.header distribute='between' padding gap denser placeChildren='center'>
            <BrandSwitcher/>
            <box.ul gap>
                { Object.entries(links).map(([label, url]) => (
                    <box.li>
                        <text.a href={ url }>{ label }</text.a>
                    </box.li>
                )) }
            </box.ul>
        </box.header>
    );
}
