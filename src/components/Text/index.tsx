import css from './styles.module.css';
import { proxy, Props, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type ElementProps = Props<HTMLElement> & ElementComponentProps;

export const text = proxy<HTMLTagsOnly, ElementProps>('text', (TagName) => {
  return (props: ElementProps) => {
    const Text = element[TagName];
    return <Text { ...props } className={ css.text } />;
  }
});
