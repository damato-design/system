import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type BoxProps = React.ComponentProps<any> & {};

function tagProxy(fn: Function) {
  const cache = new Map();
  return new Proxy(fn, {
    get(_, key: string) {
      if (!cache.has(key)) cache.set(key, fn(key));
      return cache.get(key);
    }
  })
}

function createBox(TagName: string) {
  const Box: React.FC<BoxProps> = (props: BoxProps) => {
    // Pull out props that normally could affect style
    const { className, style, ...rest } = props;
    // Render element
    return <TagName { ...rest } className={ clsx(styles.box) } />
  } 
  Box.displayName = `box.${TagName}`;
  return Box;
}

export const box = tagProxy(createBox);
