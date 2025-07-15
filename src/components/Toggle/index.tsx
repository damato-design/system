import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  MouseEvent,
} from 'react';
import { track, TrackProps } from '../Track';

export type ToggleProps = TrackProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      onMouseDown = () => {},
      ...props
    }: ToggleProps,
    ref
  ) => {
    const localRef = useRef<HTMLInputElement>(null);

    // Holds the toggle value internally only for uncontrolled mode
    const uncontrolledValue = useRef<boolean>(defaultChecked ?? false);

    const isControlled = checked !== undefined;
    const currentChecked = isControlled ? !!checked : uncontrolledValue.current;

    useEffect(() => {
      if (!localRef.current) return;
      const update = isControlled ? !!checked : !!uncontrolledValue.current;

      localRef.current.value = String(Number(!!update));
      localRef.current.setAttribute('aria-checked', String(update));
    }, [checked, isControlled]);

    useImperativeHandle(ref, () => localRef.current!, []);

    const handleClick = useCallback(
      (ev: MouseEvent<HTMLElement>) => {
        ev.preventDefault();
        const input = localRef.current;
        if (!input) return;

        const currentValue = isControlled ? !!checked : uncontrolledValue.current;

        if (!isControlled) uncontrolledValue.current = !currentValue;
        input.value = String(Number(!currentValue));
        input.setAttribute('aria-checked', String(!currentValue));

        onChange?.(!currentValue);
      },
      [checked, isControlled, onChange]
    );

    const handleMouseDown = useCallback(
      (ev: MouseEvent<HTMLElement>) => {
        ev.preventDefault();
        onMouseDown(ev);
      },
      [onMouseDown]
    );

    console.log(currentChecked);

    return (
      <track.range
        {...props}
        ref={localRef}
        role="switch"
        stretch={false}
        min={0}
        max={1}
        step={1}
        onChange={() => {}}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      />
    );
  }
);
