export type HTMLTagsOnly = keyof {
    [K in keyof JSX.IntrinsicElements as JSX.IntrinsicElements[K] extends SVGElement ? never : K]: JSX.IntrinsicElements[K]
};

export type ProxyObject<DynamicKey extends string, Props> = {
    // Each proxied component is a `forwardRef` result, so it accepts a `ref`.
    // The element varies by key, so the ref target is left loose rather than
    // baked into `Props` (see the note on `Props` below).
    [K in DynamicKey]: React.FC<Props & React.RefAttributes<any>>;
};

// Props used for the proxied element components should not include
// `RefAttributes` because refs are provided via `forwardRef` generics.
export type Props<Element = HTMLElement> = React.HTMLAttributes<Element>

// A proxied element is typed by its generic `Props`, so it doesn't expose the
// native attributes specific to a single tag (eg. a form's `action`). This
// widens one to also accept a given tag's attributes, reusing React's own
// intrinsic element types rather than re-declaring the attribute names.
// `ref` is dropped from the tag's attributes so the loose ref already carried by
// the proxied component (see `ProxyObject`) is kept rather than narrowed.
export type Intrinsic<Component, Tag extends keyof JSX.IntrinsicElements> =
    Component extends React.FC<infer P> ? React.FC<P & Omit<JSX.IntrinsicElements[Tag], 'ref'>> : never;

export const proxy = <DynamicKey extends string, Props>(
    component: string,
    // The key is the whole `DynamicKey` union rather than a generic parameter so
    // that a factory indexing another proxy (eg. `element[TagName]`) resolves to a
    // concrete component type instead of an unresolvable generic indexed access.
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