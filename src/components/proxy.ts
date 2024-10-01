type HTMLTagsOnly = {
    [K in keyof JSX.IntrinsicElements]: JSX.IntrinsicElements[K] extends React.SVGProps<SVGElement> ? never : K
  }[keyof JSX.IntrinsicElements];

export type DynamicProxy<Props> = {
    [K in HTMLTagsOnly]: React.FC<Props>;
};

export const proxy = <Props extends object>(
    component: string, 
    create: (TagName: HTMLTagsOnly) => React.FC<Props>
) => {
    const cache = new Map<string, ReturnType<typeof create>>();
    return new Proxy({}, {
        get(_, tagName: HTMLTagsOnly) {
            if (!cache.has(tagName)) {
                const Component = create(tagName);
                Component.displayName = `${component}.${tagName}`;
                cache.set(tagName, Component);
            }
            return cache.get(tagName);
        }
    }) as DynamicProxy<Props>;
}