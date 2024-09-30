import React, { ReactNode }  from 'react';
import styles from './styles.module.css';

interface ComponentProps extends React.ComponentProps<'div'> {
  /**
   * Component children
   */
  children?: ReactNode;
};

export function Box(props: ComponentProps) {
  return <div {...props} className={styles.box} />;
}
