import { box } from '../components/Box';
import { text } from '../components/Text';
import { Page } from './page';
import { ProductCards } from './product-cards';

const featureList = (
    <text.ul denser>
        <text.li>Utilize essential functionalities of the platform.</text.li>
        <text.li>Limited to core modules or tools.</text.li>
        <text.li>Single user account (or limited to a small number).</text.li>
        <text.li>Basic user profile customization.</text.li>
        <text.li>Limited storage capacity (e.g., 5GB).</text.li>
        <text.li>Includes basic data management options.</text.li>
        <text.li>Standard support via email or ticketing system.</text.li>
        <text.li>Limited response times (e.g., within 24-48 hours).</text.li>
        <text.li>Caps on transactions, projects, or requests (e.g., 100/month).</text.li>
        <text.li>Limited number of integrations or API calls.</text.li>
        <text.li>Access to basic reports and dashboards.</text.li>
        <text.li>Limited data export options.</text.li>
        <text.li>Standard encryption and secure login.</text.li>
        <text.li>Access control settings (if multi-user).</text.li>
        <text.li>Access via web app and mobile app.</text.li>
        <text.li>Basic cross-device synchronization.</text.li>
        <text.li>Limited integration with third-party services (e.g., 2-3 apps).</text.li>
        <text.li>Basic configuration options for integrations.</text.li>
        <text.li>Minimal branding or interface customization.</text.li>
        <text.li>Limited templates or pre-set themes.</text.li>
        <text.li>Access to product updates and bug fixes.</text.li>
        <text.li>No early access to beta features.</text.li>
    </text.ul>
);

const productTiers = [{
    id: 1,
    subject: <text.h3 priority='primary'>Basic</text.h3>,
    price: '15.99/yr',
    children: featureList,
    cta: 'Choose plan'
}, {
    id: 2,
    subject: <text.h3 priority='primary'>Pro</text.h3>,
    price: '24.99/yr',
    children: featureList,
    cta: 'Choose plan'
}, {
    id: 3,
    subject: <text.h3 priority='primary'>Enterprise</text.h3>,
    price: '37.99/yr',
    cta: 'Choose plan',
    children: featureList,
    mode: 'callout'
}]

export const PricingPage = () => {
    return (
        <Page>
             <box.div denser stack gap>
                <text.h2 priority='primary'>Membership Tiers</text.h2>
                <ProductCards placeChildren='top' products={ productTiers }/>
            </box.div>
        </Page>
    )
}
