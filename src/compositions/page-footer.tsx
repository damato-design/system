import { ReactNode } from 'react';
import { box } from '../components/Box';
import { text } from '../components/Text';

type FooterProps = {
    children: ReactNode
}

export const PageFooter = ({ children }: FooterProps) => {
    const links = {
        Home: '#',
        Shop: '#',
        Cart: '#'
    };

    return (
        <box.footer distribute='between' padding gap>
            { children }
            <box.ul gap stack>
                { Object.entries(links).map(([label, url]) => (
                    <box.li>
                        <text.a href={ url }>{ label }</text.a>
                    </box.li>
                )) }
            </box.ul>
        </box.footer>
    );
}
