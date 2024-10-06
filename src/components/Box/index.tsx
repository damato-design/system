import css from './styles.module.css';
import { proxy, Props, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type ElementProps = Props<HTMLElement> & ElementComponentProps;

export const box = proxy<HTMLTagsOnly, ElementProps>('box', (TagName) => {
  return (props: ElementProps) => {
    const Box = element[TagName];
    return <Box { ...props } className={ css.box }/>;
  }
});
