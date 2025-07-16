import {
  forwardRef,
  useId,
  useRef,
  useImperativeHandle,
  useEffect
} from 'react';
import { field } from '../Field';
import { input, InputProps } from '../Input';
import { box } from '../Box';
import { text } from '../Text';

type CheckboxProps = InputProps & {
  checked?: boolean | null;
  defaultChecked?: boolean | null;
  exclusive?: boolean;
  label?: string;
  priority?: 'primary' | 'auxiliary';
};

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox({
    exclusive,
    label,
    name,
    priority,
    ...props
  }, ref) {
  
  const id = useId();
  const localRef = useRef<HTMLInputElement>(null);
  const checked = 'checked' in props ? props.checked : undefined;
  const defaultChecked = 'defaultChecked' in props ? props.defaultChecked : undefined;

  useImperativeHandle(ref, () => localRef.current!, []);

  const [update] = [checked, defaultChecked].filter((c) => c !== undefined);

  useEffect(() => {
    if (localRef.current) {
      localRef.current.indeterminate = update === null;
    }
  }, [update]);

  const inputProps = {
    ...props,
    name,
    id,
    ref: localRef,
  };

  const Element = exclusive
    ? input.radio
    : input.checkbox;

  return (
    <box.div stack={false} gap placeChildren="start">
      <Element {...inputProps}/>
      {label ? (
        <text.label {...{ htmlFor: id, children: label, priority }} />
      ) : null}
    </box.div>
  );
});
