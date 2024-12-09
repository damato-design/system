import { useState, useRef, useEffect, forwardRef, CSSProperties } from "react";
import { flyout, FlyoutProvider, useFlyout } from "../components/Flyout";
import { listbox, ListboxProvider, useListbox, ItemsProps } from "../components/Listbox";
import { box } from '../components/Box';

const BRANDS = [
    'Target',
    'BestBuy',
    'HomeDepot'
]

type LogoProps = {
    src: string,
    onFocus?: () => void,
    onBlur?: () => void,
    onClick?: () => void
}

const Logo = forwardRef<HTMLImageElement, LogoProps>((props: LogoProps, ref: any) => {
    const { anchor: flyoutProps } = useFlyout();
    const { anchor: listboxProps } = useListbox();
    const style = {
        anchorName: flyoutProps.anchorName,
        maxHeight: 80
    } as CSSProperties
    return (
        <img
            { ...props }
            { ...flyoutProps }
            { ...listboxProps }
            style={ style }
            ref={ ref }
            tabIndex={ 0 }
        />
    )
});

export const BrandSwitcher = () => {
    const items = BRANDS.map((brand) => ({
        id: brand.toLowerCase(),
        children: brand
    })) as ItemsProps;

    // TODO: Save/read local storage

    const [active, setActive] = useState(items[0].id);
    const [focus, setFocus] = useState(false);
    const [show, setShow] = useState(false);
    const anchorRef = useRef(null);

    const logo = `${active}-logo.png`;

    useEffect(() => {
        const baseMode = `${active}:base`;
        const brandMode = `${active}:brand`;

        // TODO: Query select all modes, change to these.
        console.log(baseMode, brandMode);
    }, [active]);

    const anchor = (
        <Logo
            src={logo}
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
                    onActiveDescendantChange={ setActive } />
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