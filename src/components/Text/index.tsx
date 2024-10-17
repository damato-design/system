import { forwardRef, useEffect, useId } from 'react';
import css from './styles.module.css';
import clsx from 'clsx';
import { proxy, Props, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type ComponentProps = Props<HTMLElement> & ElementComponentProps & {
  priority?: 'primary' | 'secondary';
  screenreaderOnly?: React.Ref<HTMLElement>;
  standby?: boolean;
};

export const text = proxy<HTMLTagsOnly, ComponentProps>('text', (TagName) => {
  return forwardRef<HTMLElement, ComponentProps>(({
    id: givenId,
    priority,
    screenreaderOnly,
    standby,
    ...props
  }: ComponentProps, ref) => {
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
