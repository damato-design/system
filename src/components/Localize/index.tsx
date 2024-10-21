import { forwardRef } from 'react';
import { proxy } from '../Element/proxy';

export const IDREF = {
  close: 'LOCALIZE_CLOSE'
}

type LocalizeProps = {
  children: string,
}

export const localize = proxy<keyof typeof IDREF, LocalizeProps>('localize', (idRef) => {
  return forwardRef<HTMLElement, LocalizeProps>(({
    children
  }: LocalizeProps, ref) => {

    return <span
      ref={ ref }
      style={{ display: 'none' }}
      hidden
      id={ IDREF[idRef] }>
        { children }
      </span>;
  })
});
