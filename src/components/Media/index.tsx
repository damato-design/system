import css from './styles.module.css';
import { proxy, Props } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type ElementProps = Props<HTMLImageElement & HTMLAudioElement & HTMLVideoElement> & ElementComponentProps;

export const media = proxy<'img' | 'audio' | 'video', ElementProps>('media', (TagName) => {
  return (props: ElementProps) => {
    const Media = element[TagName];
    return <Media { ...props } className={ css.media }/>;
  }
});
