import { forwardRef } from 'react';
import { proxy } from '../Element/proxy';

export const IDREF = {
  close: 'LOCALIZE_CLOSE',
  previous: 'LOCALIZE_PREVIOUS',
  next: 'LOCALIZE_NEXT'
}

export type IdRefKeys = keyof typeof IDREF;

export type LocalizeProps = {
  children: string,
}

export const localize = proxy<IdRefKeys, LocalizeProps>('localize', (idRef) => {
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
