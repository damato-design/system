import css from './styles.module.css';
import { Props } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type ElementProps = Props<HTMLImageElement & HTMLAudioElement & HTMLVideoElement> & ElementComponentProps;

function getElement(src: string) {
  // TODO: Mimetype check for element
  const mimeType = src;
  switch(mimeType) {
    case 'video':
      return element.video;
    case 'audio':
      return element.audio;
    default:
      return element.img;
  }
}

export const Media = ({
  src,
  ...props
}: ElementProps) => {
  const Media = getElement(src);
  return <Media { ...props } className={ css.media } src={ src }/>;
}
