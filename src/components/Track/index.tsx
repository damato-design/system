import { forwardRef, createElement, useId } from 'react';
import css from './styles.module.scss';
import { proxy } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';
import { box } from '../Box';
import { text, TextProps } from '../Text';

type DatalistOption = React.OptionHTMLAttributes<HTMLOptionElement> & TextProps;

export type TrackProps = (React.ProgressHTMLAttributes<HTMLProgressElement>
  | React.MeterHTMLAttributes<HTMLMeterElement>
  | React.InputHTMLAttributes<HTMLInputElement>)
  & ElementProps
  & {
    stretch?: boolean,
    orientation?: 'horizontal' | 'vertical',
    datalist?: DatalistOption[],
  };

export const track = proxy<'progress' | 'meter' | 'range', TrackProps>('track', (trackType) => {
  return forwardRef<HTMLElement, TrackProps>(({
    datalist,
    orientation = 'horizontal',
    stretch = true,
    value,
    ...props
  }: TrackProps, ref) => {

    const fill = typeof value === 'number' ? `${value}%` : null;
    const datalistId = useId();

    const config = Object.assign({}, restrictProps(props), {
      'aria-orientation': orientation,
      className: css.track,
      ref,
      style: { '--fill': fill },
      value,
      list: datalist ? datalistId : null
    } as TrackProps);

    const track = trackType === 'range'
      ? createElement(element.input, { type: trackType, ...config } as React.HTMLAttributes<HTMLInputElement>)
      : createElement(element[trackType], config);

    const ticks = Array.isArray(datalist) ? (
      <datalist className={ css.datalist } id={ datalistId }>
        { datalist.map((item, idx) => <text.option {...item} key={ idx }/>) }
      </datalist>
    ) : null;

    return (
      <box.div stack gap stretch={ stretch || Boolean(ticks) } placeChildren='center'>
        { track }
        { ticks }
      </box.div>
    )
  })
});
