import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type HTMLTagsOnly = {
  [K in keyof JSX.IntrinsicElements]: JSX.IntrinsicElements[K] extends React.SVGProps<SVGElement> ? never : K
}[keyof JSX.IntrinsicElements];

export interface BoxComponentProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Loading state (interface)
   */
  standby?: boolean;
}

export interface BoxComponent extends React.FC<BoxComponentProps> {
  displayName: string;
}

type DynamicProxy = {
  [key: string]: BoxComponent;
};

const createBox = (TagName: HTMLTagsOnly) => {
  /**
   * 
   * @param {BoxComponentProps} props - Configuration Object  
   * @param {Boolean} [props.standby] - Loading state (JSDoc)
   * @returns {BoxComponent}
   */
  const Box: BoxComponent = ({
    standby,
    className,
    style,
    ...rest
  }: BoxComponentProps): JSX.Element => {
    // Render element
    return <TagName { ...rest } className={ clsx(styles.box) } data-standby={ standby } />
  } 
  Box.displayName = `box.${TagName}`;
  return Box as BoxComponent;
}

const tagProxy = () => {
  const cache = new Map<string, BoxComponent>();
  return new Proxy({}, {
    get(_, tagName: HTMLTagsOnly) {
      if (!cache.has(tagName)) cache.set(tagName, createBox(tagName));
      return cache.get(tagName);
    }
  }) as DynamicProxy
}

export const box: DynamicProxy = tagProxy();
