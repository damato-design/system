import { forwardRef, useEffect, useId } from 'react';
import css from './styles.module.css';
import clsx from 'clsx';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';

type TextProps = ElementProps & {
  priority?: 'primary' | 'secondary';
  screenreaderOnly?: React.Ref<HTMLElement>;
  standby?: boolean;
};

export const text = proxy<HTMLTagsOnly, TextProps>('text', (TagName) => {
  return forwardRef<HTMLElement, TextProps>(({
    id: givenId,
    priority,
    screenreaderOnly,
    standby,
    ...props
  }: TextProps, ref) => {
    const Text = element[TagName];
    const id = givenId || useId();

    useEffect(() => {
      // Connect the given `screenreaderOnly` to this element
      // using `id` and `aria-describedby`
      if (typeof screenreaderOnly === 'function') return;
      screenreaderOnly?.current?.setAttribute('aria-describedby', id);
      return () => screenreaderOnly?.current?.removeAttribute('aria-describedby');
    }, [screenreaderOnly, id]);

    const classNames = clsx(css.text, { [css.sronly]: Boolean(screenreaderOnly) })

    return <Text
      { ...props }
      ref={ ref }
      id={ id }
      className={ classNames }
      data-priority={ priority }/>;
  })
});
