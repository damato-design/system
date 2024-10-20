import { forwardRef } from 'react';
import css from './styles.module.css';
import { element, ElementProps } from '../Element';

export type MediaProps = (React.ImgHTMLAttributes<HTMLImageElement>
  | React.AudioHTMLAttributes<HTMLAudioElement>
  | React.VideoHTMLAttributes<HTMLVideoElement>) 
  & ElementProps
  & {
    /**
     * If set, component is shown in a loading state.
     */
    standby?: boolean;
  };

function getElement(src: string | undefined) {
  if (!src) return element.img;

  const { pathname } = new URL(src);
  const ext = pathname.substring(pathname.lastIndexOf('.'));

  switch(ext) {
    case '.avi':
    case '.mp4':
    case '.mpeg':
    case '.ogv':
    case '.ts':
    case '.webm':
    case '.3gp':
    case '.3g2':
      return element.video;
    case '.aac':
    case '.mid':
    case '.midi':
    case '.mp3':
    case '.oga':
    case '.opus':
    case '.wav':
    case '.weba':
      return element.audio;
    default:
      return element.img;
  }
}

export const Media = forwardRef<HTMLElement, MediaProps>(({
  standby,
  className,
  style,
  ...props
}: MediaProps, ref) => {

  const Media = getElement(props.src);
  return <Media { ...props } ref={ ref } className={ css.media }/>;
})