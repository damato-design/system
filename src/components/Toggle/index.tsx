import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  PointerEvent,
} from 'react';
import { track, TrackProps } from '../Track';

export type ToggleProps = TrackProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({
      checked,
      defaultChecked,
      onChange,
      onMouseDown = () => {},
      ...props
    }: ToggleProps, ref) => {
    
    const localRef = useRef<HTMLInputElement>(null);
    const uncontrolledValue = useRef(defaultChecked ?? false);
    const isControlled = checked !== undefined;

    useEffect(() => {
      const input = localRef.current;
      if (!input) return;

      const value = isControlled ? checked : uncontrolledValue.current;
      input.value = String(Number(value));
      input.setAttribute('aria-checked', String(value));
    }, [checked, isControlled]);

    useImperativeHandle(ref, () => localRef.current!, []);

    const handlePointerDown = useCallback(
      (ev: PointerEvent<HTMLElement>) => {
        ev.preventDefault();
        const input = localRef.current;
        if (!input) return;

        const currentValue = isControlled ? checked : uncontrolledValue.current;
        const nextValue = !currentValue;

        if (!isControlled) uncontrolledValue.current = nextValue;
        input.value = String(Number(nextValue));
        input.setAttribute('aria-checked', String(nextValue));

        onChange?.(nextValue);
      },
      [checked, isControlled, onChange]
    );

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
        onPointerDown={handlePointerDown}
      />
    );
  }
);
