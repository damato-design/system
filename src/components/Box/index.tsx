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

type DynamicProxy<T> = {
  [K in HTMLTagsOnly]: React.FC<T>;
};

type Create<T> = (TagName: HTMLTagsOnly) => React.FC<T>

const createBox: Create<BoxComponentProps> = (TagName) => {
  return ({
    standby,
    className,
    style,
    ...rest
  }: BoxComponentProps) => {
    // Render element
    return <TagName { ...rest } className={ clsx(styles.box) } data-standby={ standby } />
  }
}

const tagProxy = <T extends {}>(component: string, create: Create<T>): DynamicProxy<T> => {
  const cache = new Map<string, React.FC<T>>();
  return new Proxy({}, {
    get(_, tagName: HTMLTagsOnly) {
      if (!cache.has(tagName)) {
        const Component = create(tagName);
        Component.displayName = `${component}.${tagName}`;
        cache.set(tagName, Component);
      }
      return cache.get(tagName);
    }
  }) as DynamicProxy<T>;
}

export const box: DynamicProxy<BoxComponentProps> = tagProxy('box', createBox);
