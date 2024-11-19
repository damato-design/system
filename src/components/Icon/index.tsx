import css from './styles.module.scss';
import { proxy, Props } from '../Element/proxy';

type IconProps = Props & {
  standby?: boolean,
  priority?: 'primary' | 'secondary'
}

export const icon = proxy<string, IconProps>('icon', (reference) => {
  return ({
    standby = true,
    priority,
    ...props
  }: IconProps) => {
    return (
      <i
        { ...props }
        role='presentation'
        data-priority={ priority }
        data-standby={ standby }
        className={ css.icon }>
        { reference }
      </i>
    );
  }
});
