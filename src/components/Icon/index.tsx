import css from './styles.module.scss';
import { text, TextProps } from '../Text';
import { proxy } from '../Element/proxy';

export type IconProps = TextProps & {};

/**
 * Creates a `<icon.ref/>` component
 * 
 * @param {IconProps} props - Component configuration object
 * @returns {ReactElement} - A icon component
 */
export const icon = proxy<string, IconProps>('icon', (reference) => {
  return (props: IconProps) => {
    return (
      <text.i
        { ...props }
        role='presentation'
        className={ css.icon }>
        { reference }
      </text.i>
    );
  }
});
