type HTMLTagsOnly = {
    [K in keyof JSX.IntrinsicElements]: JSX.IntrinsicElements[K] extends React.SVGProps<SVGElement> ? never : K
  }[keyof JSX.IntrinsicElements];

type ProxyObject<Props> = {
    [K in HTMLTagsOnly]: React.FC<Props>;
};

export type Props<Element = HTMLElement> = React.HTMLAttributes<Element>

export const proxy = <Props extends object, DynamicKey extends string>(
    component: string, 
    create: (TagName: DynamicKey) => React.FC<Props>
) => {
    const cache = new Map<string, ReturnType<typeof create>>();
    return new Proxy({}, {
        get(_, tagName: DynamicKey) {
            if (!cache.has(tagName)) {
                const Component = create(tagName);
                Component.displayName = `${component}.${tagName}`;
                cache.set(tagName, Component);
            }
            return cache.get(tagName);
        }
    }) as ProxyObject<Props>;
}