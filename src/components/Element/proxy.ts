export type HTMLTagsOnly = keyof {
    [K in keyof JSX.IntrinsicElements as JSX.IntrinsicElements[K] extends SVGElement ? never : K]: JSX.IntrinsicElements[K]
};

export type ProxyObject<DynamicKey extends string, Props> = {
    [K in DynamicKey]: React.FC<Props>;
};

// Props used for the proxied element components should not include
// `RefAttributes` because refs are provided via `forwardRef` generics.
export type Props<Element = HTMLElement> = React.HTMLAttributes<Element>

export const proxy = <DynamicKey extends string, Props>(
    component: string,
    // allow the creator to be generic over the specific key so callers
    // can compute more precise types based on the tag name
    create: <K extends DynamicKey>(key: K) => React.FC<Props>
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