import { forwardRef, useState, useCallback } from 'react';
import css from './styles.module.scss';
import { element, ElementProps, restrictProps } from '../Element';

export type MediaProps = (React.ImgHTMLAttributes<HTMLImageElement>
  | React.AudioHTMLAttributes<HTMLAudioElement>
  | React.VideoHTMLAttributes<HTMLVideoElement>) 
  & ElementProps
  & {
    src: string[] | string,
    /**
     * Avoids loading presentation when set to false
     */
    standby?: boolean;
  };

function getElement(src: string | undefined) {
  if (!src) return 'picture';

  let ext = '';
  try {
    const { pathname } = new URL(src);
    ext = pathname.substring(pathname.lastIndexOf('.'));
  } catch (e) {};

  switch(ext) {
    case '.avi':
    case '.mp4':
    case '.mpeg':
    case '.ogv':
    case '.ts':
    case '.webm':
    case '.3gp':
    case '.3g2':
      return 'video';
    case '.aac':
    case '.mid':
    case '.midi':
    case '.mp3':
    case '.oga':
    case '.opus':
    case '.wav':
    case '.weba':
      return 'audio';
    default:
      return 'picture';
  }
}

export const Media = forwardRef<HTMLElement, MediaProps>(({
  src,
  standby = true,
  ...props
}: MediaProps, ref) => {

  const [complete, setComplete] = useState(false);
  const onComplete = useCallback((ev: any) => {
    ev.target.tagName !== 'PICTURE' && setComplete(true);
  }, []);

  const sources = [''].concat(src).filter(Boolean);

  const [tagName, ...rest] = new Set(sources.map(getElement));
  if (!tagName) return null;
  if (rest.length) console.warn('Mixed sources found, all sources must be the same type: ', rest);
  
  const Media = element[tagName];
  const config = Object.assign({}, props, {
    controls: tagName !== 'picture' ? true : null
  });
  const fallback = (<img 
    src={ sources[0] }
    onLoad={ onComplete }
    onError={ onComplete }
  />);

  return (
    <Media
      { ...restrictProps(config) }
      ref={ ref }
      onLoadedData={ onComplete }
      onError={ onComplete }
      className={ css.media }
      data-complete={ complete }
      data-standby={ standby }>
      { sources.map((src) => <source {...{ [tagName === 'picture' ? 'srcSet' : 'src']: src }} key={ src }/>) }
      { tagName === 'picture' ? fallback : null }
    </Media>
  );
})