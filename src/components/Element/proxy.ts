export type HTMLTagsOnly =  Exclude<keyof JSX.IntrinsicElements, keyof SVGElementTagNameMap>;

export type ProxyObject<DynamicKey extends string, Props> = {
    [K in DynamicKey]: React.FC<Props>;
};

export type Props<Element = HTMLElement> = React.HTMLAttributes<Element>

export const proxy = <DynamicKey extends string, Props>(
    component: string, 
    create: (key: DynamicKey) => React.FC<Props>
) => {
    const cache = new Map<string, ReturnType<typeof create>>();
    return new Proxy({}, {
        get(_, key: DynamicKey) {
            const displayName = `${component}.${key}`;
            if (!cache.has(displayName)) {
                const Component = create(key);
                Component.displayName = displayName;
                cache.set(displayName, Component);
            }
            return cache.get(displayName);
        }
    }) as ProxyObject<DynamicKey, Props>;
}