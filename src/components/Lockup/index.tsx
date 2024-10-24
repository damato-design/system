import { createElement, cloneElement, forwardRef, useId, useEffect, ReactElement } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { text, TextProps } from '../Text';
import { icon } from '../Icon';
import { restrictProps } from '../Element';

function getIcon(iconRef: string | undefined, subject: ReactElement) {
  if (!iconRef) return null;
  if (iconRef && !subject) return createElement(icon[iconRef]);
  return cloneElement(subject as ReactElement, {
    "aria-hidden": true,
    style: {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'start'
    },
  }, createElement(icon[iconRef]));
}

export type LockupProps = BoxProps & {
  icon?: string,
  subject?: ReactElement<TextProps>,
  passiveMessage?: string,
  errorMessage?: string,
  getInputProps?: ({}) => void,
};

export const lockup = proxy<HTMLTagsOnly, LockupProps>('lockup', (TagName) => {
  return forwardRef<HTMLElement, LockupProps>(({
    icon: iconRef,
    children,
    subject,
    passiveMessage,
    errorMessage,
    getInputProps,
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

    const subjectElem = (
      <text.div
        id={ subjectId }
        standby={ false }>
        { subject }
      </text.div>
    );

    const passiveElem = (
      <text.p 
        id={ passiveId }
        priority='auxiliary'>
        { passiveMessage }
      </text.p>
    );

    const errorElem = (
      <text.p 
        aria-live='polite'
        id={ errorId }
        priority='auxiliary'
        standby={ false }>
        { errorMessage }
      </text.p>
    );

    return (
      <Element { ...restrictProps(props) } ref={ ref } gap>
          { getIcon(iconRef, subject as ReactElement) }
          <box.div stack gap stretch>
            { subject ? subjectElem : null }
            { passiveMessage ? passiveElem : null }
            <box.div stack gap stretch>
                { errorElem }
                { children }
            </box.div>
          </box.div>
      </Element>
    )

  })
});
