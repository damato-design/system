import React from 'react';
import styles from './styles.module.css';

interface ComponentProps extends React.ComponentProps<'div'> {

}

function Box(props: ComponentProps) {
  return <div className={styles.box} {...props} />;
}

export default Box;