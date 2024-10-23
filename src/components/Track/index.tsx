import { forwardRef, createElement } from 'react';
import css from './styles.module.css';
import clsx from 'clsx';
import { proxy } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';

export type TrackProps = ElementProps & {
  orientation?: 'horizontal' | 'vertical'
};

export const track = proxy<'progress' | 'meter' | 'range', TrackProps>('track', (trackType) => {
  return forwardRef<HTMLElement, TrackProps>(({
    orientation = 'horizontal',
    ...props
  }: TrackProps, ref) => {

    const config = Object.assign({}, restrictProps(props), {
      'aria-orientation': orientation,
      className: clsx(css.track),
      ref,
    } as TrackProps);

    return trackType === 'range'
      ? createElement(element.input, { type: trackType, ...config } as React.HTMLAttributes<HTMLInputElement>)
      : createElement(element[trackType], config);
  })
});
