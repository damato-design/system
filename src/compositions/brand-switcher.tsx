import { useState, useRef, forwardRef, CSSProperties, useCallback, useEffect } from 'react';
import { flyout, FlyoutProvider, useFlyout } from '../components/Flyout';
import { listbox, ListboxProvider, useListbox, ItemsProps } from '../components/Listbox';
import { box } from '../components/Box';

const BRANDS = [
    'Target',
    'BestBuy',
    'HomeDepot'
]

const BRAND_KEY = 'brand';
let channel: BroadcastChannel;

type Message = {
    type: string;
    payload?: object
}

type LogoProps = {
    src: string,
    onFocus?: () => void,
    onBlur?: () => void,
    onClick?: () => void
}

type Img = HTMLImageElement & {
    anchorName?: string
}

const Logo = forwardRef<Img, LogoProps>((props: LogoProps, ref: any) => {
    const { anchor: flyoutProps } = useFlyout();
    const { anchor: listboxProps } = useListbox();
    const { anchorName, ...flyoutRest } = flyoutProps;
    const style = {
        anchorName,
        maxHeight: 80
    } as CSSProperties

    return (
        <img
            { ...props }
            { ...flyoutRest }
            { ...listboxProps }
            style={ style }
            ref={ ref }
            tabIndex={ 0 }
        />
    )
});


function updateBrand(brand: string) {
    const message: Message = {
        type: 'MODE_REQUEST'
    };

    if (!channel) {
        channel = new BroadcastChannel('mode-channel');
        message.payload = { brand };
    }

    if (window.localStorage.getItem(BRAND_KEY) !== brand) {
        window.localStorage.setItem(BRAND_KEY, brand);
        message.payload = { brand };
    }

    if (message.payload) {
        channel.postMessage(message);
    }
}

export const BrandSwitcher = () => {
    const items = BRANDS.map((brand) => ({
        id: brand.toLowerCase(),
        children: brand
    })) as ItemsProps;

    const ls = window.localStorage.getItem(BRAND_KEY);
    const [active, setActive] = useState(ls || items[0].id);
    const [focus, setFocus] = useState(false);
    const [show, setShow] = useState(false);
    const anchorRef = useRef(null);

    const onChange = useCallback((id: string) => setActive(id), []);

    useEffect(() => updateBrand(active), [active]);

    const anchor = (
        <Logo
            src={`${active}-logo.png`}
            ref={ anchorRef }
            onFocus={ () => setFocus(true) }
            onBlur={ () => setFocus(false) }
            onClick={ () => setShow(!show) }
        />
    );

    const menu = (
        <flyout.div
            behavior='menu'
            onClose={ () => setShow(false) }
            stretch>
            <box.div
                stretch
                purpose='surface'
                priority='secondary'>
                <listbox.div
                    items={ items }
                    visualFocus={ focus }
                    activeDescendant={ active }
                    onActiveDescendantChange={ onChange } />
            </box.div>
        </flyout.div>
    );

    return (
        <FlyoutProvider>
            <ListboxProvider behavior='menu'>
                { anchor }
                { show ? menu : null }
            </ListboxProvider>
        </FlyoutProvider>
    )
}