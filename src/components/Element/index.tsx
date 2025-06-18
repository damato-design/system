import { forwardRef, createElement, memo } from 'react';
import { proxy, Props, HTMLTagsOnly } from './proxy';

export function restrictProps({
  id,
  tabIndex,
  className,
  style,
  ...props
}: Props) {
  return props;
}

export type ElementProps = Props & {
  /**
   * The `mode` is a way to expressively enhance the scope in which it is applied.
   */
  mode?: string | string[],
  /**
   * Applies the `mode="system:denser"` to the component
   */
  denser?: boolean,
}

export const element = proxy<HTMLTagsOnly, ElementProps>('element', (TagName) => {
  const Component = forwardRef<HTMLElement, ElementProps>(({
    className,
    denser,
    mode,
    ...rest
  }: ElementProps, ref) => {
    const normalizedMode = Array.isArray(mode) ? mode : [mode];
    const modes = normalizedMode.filter(Boolean);
    if (denser) modes.push('system:denser');
    const props = { ...rest, ref, className } as any;
    if (modes.length) {
      props['data-mode'] = modes.join(' ');
    }

    return createElement(TagName, props);
  });

  return memo(Component) as typeof Component;
});
