import { createElement, cloneElement, forwardRef, useId, useEffect, ReactElement } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { text, TextProps } from '../Text';
import { icon } from '../Icon';

function getIcon(iconRef: string | undefined, subject: ReactElement) {
  if (!iconRef) return null;
  if (iconRef && !subject) return createElement(icon[iconRef]);
  const subjectStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  return cloneElement(subject as ReactElement, {
    "aria-hidden": true,
    style: subjectStyle,
  }, createElement(icon[iconRef]));
}

export type LockupProps = BoxProps & {
  icon?: string,
  subject?: ReactElement<TextProps>,
  passiveMessage?: string,
  errorMessage?: string,
  getInputProps?: ({}) => void,
  onClose?: (ev: any) => void,
};

export const lockup = proxy<HTMLTagsOnly, LockupProps>('lockup', (TagName) => {
  return forwardRef<HTMLElement, LockupProps>(({
    icon: iconRef,
    children,
    subject,
    passiveMessage,
    errorMessage,
    getInputProps,
    onClose,
    mode,
    ...props
  }: LockupProps, ref) => {

    const Element = box[TagName];

    const subjectId = useId();
    const passiveId = useId();
    const errorId = useId();

    useEffect(() => {
      typeof getInputProps === 'function'
        && getInputProps({
          'aria-labelledby': subjectId,
          'aria-describedby': [passiveId, errorId].join(' ')
        })
    }, [getInputProps]);

    // TODO: optional onClose button, use bouyant approach, remember no hard code label

    return (
      <Element { ...props } ref={ ref } gap>
          { getIcon(iconRef, subject as ReactElement) }
          <box.div stack gap>
            { subject ? <text.span id={ subjectId }>{ subject }</text.span> : null }
            { passiveMessage ? <text.p id={ passiveId }>{ passiveMessage }</text.p> : null }
            <box.div mode={ mode } stack gap prose>
                <text.p aria-live='polite' id={ errorId }>{ errorMessage }</text.p>
                { children }
            </box.div>
          </box.div>
      </Element>
    )

  })
});
