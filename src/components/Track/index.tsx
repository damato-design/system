import { forwardRef, createElement, useId, useMemo } from 'react';
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
    items?: DatalistOption[],
    min?: Number,
    max?: Number,
  };

export const track = proxy<'progress' | 'meter' | 'range', TrackProps>('track', (trackType) => {
  return forwardRef<HTMLElement, TrackProps>(({
    items,
    role,
    orientation = 'horizontal',
    stretch = true,
    defaultValue,
    value,
    min = 0,
    max = 100,
    ...props
  }: TrackProps, ref) => {

    const datalistId = useId();
    const [val] = [defaultValue, value].filter(Number.isFinite);

    const config = Object.assign({}, restrictProps(props), {
      'aria-orientation': orientation,
      className: css.track,
      ref,
      style: {
        '--fill': typeof val === 'number'
          ? `${Number(val) * 100 / (Number(max) - Number(min))}%`
          : null,
        '--length': items?.length,
        width: stretch ? '100%' : 0
      },
      role: role ? 'none' : null,
      defaultValue,
      value,
      min,
      max,
      list: items ? datalistId : null
    } as TrackProps);

    const track = useMemo(() => {
      return trackType === 'range'
        ? createElement(element.input, { type: trackType, ...config } as React.HTMLAttributes<HTMLInputElement>)
        : createElement(element[trackType], config);
    }, [trackType, config]);

    const datalist = useMemo(() => {
      return Array.isArray(items) ? (
        <datalist className={ css.datalist } id={ datalistId }>
          { items.map((item, idx) => <text.option {...item} key={ idx }/>) }
        </datalist>
      ) : null
    }, [items, datalistId, css.datalist]);

    return (
      <box.div
        role={ role }
        stack
        stretch={ stretch || Boolean(datalist) }
        placeChildren='center'>
        { track }
        { datalist }
      </box.div>
    )
  })
});
