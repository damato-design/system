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

type DynamicProxy<T> = {
  [K in HTMLTagsOnly]: T;
};

type Create<T> = (component: string, tagName: HTMLTagsOnly) => T;

const createBox: Create<BoxComponent> = (component, TagName) => {
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
  Box.displayName = `${component}.${TagName}`;
  return Box as BoxComponent;
}

const tagProxy = <T extends any>(component: string, create: Create<T>) => {
  const cache = new Map<string, T>();
  return new Proxy({}, {
    get(_, tagName: HTMLTagsOnly) {
      if (!cache.has(tagName)) cache.set(tagName, create(component, tagName));
      return cache.get(tagName);
    }
  }) as DynamicProxy<T>
}

export const box: DynamicProxy<BoxComponent> = tagProxy('box', createBox);
