import { ReactNode } from 'react';
import { box } from '../components/Box';
import { text } from '../components/Text';

type HeaderProps = {
    children: ReactNode
}

export const PageHeader = ({ children }: HeaderProps) => {
    const links = {
        Home: '#',
        Shop: '#',
        Cart: '#'
    };

    return (
        <box.header distribute='between' padding gap denser>
            { children }
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
