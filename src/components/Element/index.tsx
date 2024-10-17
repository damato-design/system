import { forwardRef } from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { proxy, Props, HTMLTagsOnly } from './proxy';

export interface ElementComponentProps extends Props {
  mode?: string,
}

export const element = proxy<HTMLTagsOnly, Props>('element', (TagName) => {
  return forwardRef(({
    className,
    mode,
    ...rest
  }: ElementComponentProps, ref) => {

    return (
      <TagName
        { ...rest }
        ref={ ref }
        className={ clsx(css.element, className) }
        data-mode={ mode }/>
    )
  })
});
