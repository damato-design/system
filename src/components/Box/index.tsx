import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type boxProps = React.ComponentProps<any> & {
  /**
   * Determines if the component should show a loading state
   */
  standby?: boolean;
};

type boxComponent = (tagName: string) => React.FC<boxProps>;

const tagProxy = (fn: boxComponent) => {
  const cache = new Map();
  return new Proxy(fn, {
    get(_, tagName: string) {
      if (!cache.has(tagName)) cache.set(tagName, fn(tagName));
      return cache.get(tagName);
    }
  })
}

const createBox: boxComponent = (TagName) => {
  const Box = ({
    standby,
    className,
    style,
    ...rest
  }: boxProps): JSX.Element => {
    // Render element
    return <TagName { ...rest } className={ clsx(styles.box) } data-standby={ standby } />
  } 
  Box.displayName = `box.${TagName}`;
  return Box;
}

export const box = tagProxy(createBox);
