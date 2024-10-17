import { forwardRef, createElement } from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { proxy, Props, HTMLTagsOnly } from './proxy';

export interface ElementComponentProps extends Props {
  mode?: string,
}

export const element = proxy<HTMLTagsOnly, ElementComponentProps>('element', (TagName) => {
  return forwardRef<HTMLElement, ElementComponentProps>(({
    className,
    mode,
    ...rest
  }: ElementComponentProps, ref) => {

    const classNames = clsx(css.element, className);
    return createElement(TagName, { ...rest, ref, className: classNames, 'data-mode': mode });
  })
});
