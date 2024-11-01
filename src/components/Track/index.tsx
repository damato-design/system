import { forwardRef, createElement } from 'react';
import css from './styles.module.scss';
import clsx from 'clsx';
import { proxy } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';



export type TrackProps = (React.ProgressHTMLAttributes<HTMLProgressElement>
  | React.MeterHTMLAttributes<HTMLMeterElement>
  | React.InputHTMLAttributes<HTMLInputElement>)
  & ElementProps
  & {
    orientation?: 'horizontal' | 'vertical',
  };

export const track = proxy<'progress' | 'meter' | 'range', TrackProps>('track', (trackType) => {
  return forwardRef<HTMLElement, TrackProps>(({
    orientation = 'horizontal',
    value,
    ...props
  }: TrackProps, ref) => {

    const fill = typeof value === 'number' ? `${value}%` : null;

    const config = Object.assign({}, restrictProps(props), {
      'aria-orientation': orientation,
      className: clsx(css.track),
      ref,
      style: { '--fill': fill },
      value
    } as TrackProps);

    return trackType === 'range'
      ? createElement(element.input, { type: trackType, ...config } as React.HTMLAttributes<HTMLInputElement>)
      : createElement(element[trackType], config);
  })
});
