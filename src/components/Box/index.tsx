import React from 'react';
import styles from './styles.module.css';

interface ComponentProps extends React.ComponentProps<'div'> {
  children: string;
};

export function Box(props: ComponentProps) {
  return <div {...props} className={styles.box} />;
}
