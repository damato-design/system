import { useCallback, useState } from 'react';
import { box } from '../components/Box';
import { text } from '../components/Text';
import { card } from '../components/Card';
import { field } from '../components/Field';
import { input } from '../components/Input';
import { Button } from '../components/Button';

const customerService = [
    'Check Order Status',
    'Pay Your Credit Card',
    'Order Cancellation',
    'Return Policy',
    'Refund Policy',
    'Shipping & Delivery',
    'Product Recalls',
    'Help & FAQs',
    'My Preference Center',
    'Privacy & Security Center'
];

const resources = [
    'Specials & Offers',
    'Military Discount Benefit',
    'DIY Projects & Ideas',
    'Truck & Tool Rental',
    'Installation & Services',
    'Moving Supplies & Rentals',
    'Protection Plans',
    'Rebate Center',
    'Gift Cards',
    'Catalog',
    'Subscriptions'
];

const aboutUs = [
    'Careers',
    'Corporate Information',
    'Digital Newsroom',
    'Our Foundation',
    'Investor Relations',
    'Government Customers',
    'Supplies & Providers',
    'Affiliate Program',
    'Eco Actions',
    'Corporate Responsibility',
    'Licensing Information'
];

type LinkGroupProps = {
    links: string[]
}

function LinkGroup({ links }: LinkGroupProps) {
    return (
        <box.ul gap stack>
            { links.map((label) => (
                <box.li>
                    <text.a href='#' priority='auxiliary'>{ label }</text.a>
                </box.li>
            )) }
        </box.ul>
    );
}

function NewsletterSignup() {
    const [value, setValue] = useState('');
    const subject = <text.h3 priority='primary'>Newsletter Signup</text.h3>;
    const passiveMessage = 'Sign up for our newsletter to catch great deals on products!';
    const onChange = useCallback(({ target }: any) => {
        setValue(target.value);
    }, [value]);

    return (
        <card.form
            denser
            padding
            gap
            subject={ subject }
            passiveMessage={passiveMessage}
            purpose='surface'>
            <field.div stretch>
                <input.email
                    name='email'
                    value={ value }
                    onChange={ onChange }/>
                <Button priority='primary'>Submit</Button>
            </field.div>
        </card.form>
    )
}

export const PageFooter = () => {
    return (
        <box.footer distribute='between'
            padding
            gap
            denser
            stack
            placeChildren='top'>
            <box.div gap>
                <LinkGroup links={ customerService }/>
                <LinkGroup links={ resources }/>
                <LinkGroup links={ aboutUs }/>
                <NewsletterSignup/>
            </box.div>
            <text.p denser priority='auxiliary'>
                In-store pricing may vary. Prices and offers are subject to change.
                © 2024 Company. All rights reserved. COMPANY, the COMPANY logo,
                the tag design are trademarks of Company and its affiliated companies.
            </text.p>
        </box.footer>
    );
}
