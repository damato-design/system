import { forwardRef, useEffect, useId } from 'react';
import css from './styles.module.css';
import { proxy, Props, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type ElementProps = Props<HTMLElement> & ElementComponentProps & {
  priority?: 'primary' | 'secondary';
  screenreaderOnly?: React.Ref<HTMLElement>;
  standby?: boolean;
};

export const text = proxy<HTMLTagsOnly, ElementProps>('text', (TagName) => {
  return forwardRef(({
    id: givenId,
    priority,
    screenreaderOnly,
    standby,
    ...props
  }: ElementProps, ref) => {
    const Text = element[TagName];
    const id = givenId || useId();

    useEffect(() => {
      // Connect the given `screenreaderOnly` to this element
      // using `id` and `aria-describedby`
      if (typeof screenreaderOnly !== 'function' && screenreaderOnly?.current) {
        screenreaderOnly.current.setAttribute('ara-describedby', id);
      }
    }, [screenreaderOnly, id]);

    return <Text
      { ...props }
      ref={ ref }
      id={ id }
      className={ css.text }
      data-priority={ priority }/>;
  })
});
