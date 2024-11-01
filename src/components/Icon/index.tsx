import css from './styles.module.scss';
import { proxy, Props } from '../Element/proxy';

type IconProps = Props & {
  standby?: boolean
}

export const icon = proxy<string, IconProps>('icon', (reference) => {
  return ({
    standby = true,
    ...props
  }: IconProps) => {
    return (
      <i
        { ...props }
        role='presentation'
        data-standby={ standby }
        className={ css.icon }>
        { reference }
      </i>
    );
  }
});
