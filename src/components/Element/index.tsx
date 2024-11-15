import { forwardRef, createElement } from 'react';
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
  mode?: string,
}

export const element = proxy<HTMLTagsOnly, ElementProps>('element', (TagName) => {
  return forwardRef<HTMLElement, ElementProps>(({
    className,
    mode,
    ...rest
  }: ElementProps, ref) => {

    return createElement(TagName, { ...rest, ref, className, 'data-mode': mode });
  })
});
