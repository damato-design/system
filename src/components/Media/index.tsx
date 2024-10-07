import css from './styles.module.css';
import { Props } from '../Element/proxy';
import { element, ElementComponentProps } from '../Element';

type ElementProps = Props<HTMLImageElement & HTMLAudioElement & HTMLVideoElement> & ElementComponentProps;

function getElement(src: string) {  
  const ext = src.substring(src.lastIndexOf('.'));

  switch(ext) {
    case 'avi':
    case 'mp4':
    case 'mpeg':
    case 'ogv':
    case 'ts':
    case 'webm':
    case '3gp':
    case '3g2':
      return element.video;
    case 'aac':
    case 'mid':
    case 'midi':
    case 'mp3':
    case 'oga':
    case 'opus':
    case 'wav':
    case 'weba':
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
