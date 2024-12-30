import { box } from '../components/Box';
import { BrandSwitcher } from './brand-switcher';
import { SiteSearch } from './site-search';
import { Button } from '../components/Button';
import { SiteMenu } from './site-menu';

export const PageHeader = () => {
    return (
        <box.header distribute='between' padding gap denser placeChildren='center'>
            <BrandSwitcher/>
            <SiteMenu/>
            <SiteSearch/>
            <Button icon='account_circle'>Sign In</Button>
            <Button icon='shopping_cart' aria-label='cart' />
        </box.header>
    );
}
