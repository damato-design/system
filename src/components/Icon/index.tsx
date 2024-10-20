import css from './styles.module.css';
import { proxy, Props } from '../Element/proxy';

export const icon = proxy<string, Props>('icon', (reference) => {
  return (props: Props) => {
    return <span
      { ...props }
      role='presentation'
      data-icon={ reference }
      className={ css.icon }>
        { reference }
      </span>;
  }
});
