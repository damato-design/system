import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { proxy, DynamicProxy } from '../proxy';

export interface BoxComponentProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Loading state (interface)
   */
  standby?: boolean;
}

export const box: DynamicProxy<BoxComponentProps> = proxy('box', (TagName) => {
  return ({
    standby,
    className,
    style,
    ...rest
  }: BoxComponentProps) => {
    // Render element
    return (
      <TagName 
        { ...rest }
        className={ clsx(styles.box) }
        data-standby={ standby } />
    )
  }
});
