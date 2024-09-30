import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface BoxComponentProps {
  /**
   * Determines if the component should show a loading state
   */
  standby?: boolean;
}

interface BoxComponent extends React.FC<BoxComponentProps> {
  displayName: string;
}

type DynamicProxy = {
  [key: string]: BoxComponent;
};

const createBox = (tagName: string) => {
  const Box: BoxComponent = ({
    standby,
    className,
    style,
    ...rest
  }: BoxComponentProps): JSX.Element => {
    // Render element
    const Tag = tagName as keyof JSX.IntrinsicElements;
    return <Tag { ...rest } className={ clsx(styles.box) } data-standby={ standby } />
  } 
  Box.displayName = `box.${tagName}`;
  return Box as BoxComponent;
}

const tagProxy = () => {
  const cache = new Map();
  return new Proxy({}, {
    get(_, tagName: string) {
      if (!cache.has(tagName)) cache.set(tagName, createBox(tagName));
      return cache.get(tagName);
    }
  })
}

export const box: DynamicProxy = tagProxy();
