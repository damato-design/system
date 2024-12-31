import { box } from '../components/Box';
import { BrandSwitcher } from './brand-switcher';
import { SiteSearch } from './site-search';
import { Button } from '../components/Button';
import { SiteMenu } from './site-menu';

const mobile = (
    <>
        <box.div stretch distribute='between' placeChildren='center'>
            <BrandSwitcher/>
            <SiteMenu/>
            <Button icon='account_circle' aria-label="sign in"/>
            <Button icon='shopping_cart' aria-label='cart' />
        </box.div>
        <SiteSearch/>
    </>
)

export const PageHeader = () => {
    return (
        <box.header
            padding gap denser stretch
            mode='callout'
            purpose='surface'
            distribute='between'
            placeChildren='center'
            round={ false }
            reflow={{
                560: {
                    children: mobile,
                    stack: true,
                    placeChildren: undefined
                }
            }}>
            <BrandSwitcher/>
            <SiteMenu label='Menu'/>
            <SiteSearch/>
            <Button icon='account_circle'>Sign In</Button>
            <Button icon='shopping_cart' aria-label='cart' />
        </box.header>
    );
}
