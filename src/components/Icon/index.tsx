import css from './styles.module.scss';
import { text, TextProps } from '../Text';
import { proxy } from '../Element/proxy';

/**
 * Creates a `<icon.ref/>` component
 * 
 * @param {TextProps} props - Component configuration object
 * @returns {ReactElement} - A icon component
 */
export const icon = proxy<string, TextProps>('icon', (reference) => {
  return (props: TextProps) => {
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
