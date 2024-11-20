import {
    createElement,
    forwardRef,
    useId,
    ReactElement,
    createContext,
    useContext,
    ReactNode,
  } from 'react';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { box, BoxProps } from '../Box';
import { text, TextProps } from '../Text';
import { icon } from '../Icon';
import { restrictProps } from '../Element';

const LockupContext = createContext(null);

type LockupConfig = {
  subject: { id: string },
  passive: { id: string },
  error: { id: string},
  input: {
    'aria-labelledby': string,
    'aria-describedby': string,
  }
}

export const useLockup = () => {
  const context = useContext(LockupContext);
  return context || {} as LockupConfig;
};

export const LockupProvider = (props: any) => {
  const subjectId = useId();
  const passiveId = useId();
  const errorId = useId();

  const value = {
    subject: { id: subjectId },
    passive: { id: passiveId },
    error: { id: errorId },
    input: {
      'aria-labelledby': subjectId,
      'aria-describedby': [passiveId, errorId].join(' '),
    }
  }

  return <LockupContext.Provider { ...props } value={ value }/>
}


function getIcon(iconRef: string | undefined, subject: ReactElement<TextProps>) {
  if (!iconRef) return null;
  if (iconRef && !subject) return createElement(icon[iconRef]);
  const IconElement = icon[iconRef];
  const { displayName } = subject.type as unknown as { displayName: string };
  const { children, ...props } = Object.assign({
    priority: 'secondary',
    // style: { '--bump': displayName === 'text.label' ? 1 : 0 }
  }, subject.props);
  return <IconElement { ...props } />;
}

export type LockupProps = BoxProps & {
  icon?: string,
  subject?: ReactElement<TextProps>,
  passiveMessage?: string,
  errorMessage?: string,
};

function SubjectComponent(props: { children: ReactNode }) {
  const ctx = useLockup();
  if (!props.children) return null;
  return (
    <box.div
      { ...props }
      id={ ctx.subject.id }
      standby={ false }/>
  )
}

function PassiveComponent(props: { children: ReactNode }) {
  const ctx = useLockup();
  if (!props.children) return null;
  return (
    <text.p
      { ...props }
      id={ ctx.passive.id }
      priority='auxiliary'/>
  )
}

function ErrorComponent(props: { children: ReactNode }) {
  const ctx = useLockup();
  return (
    <text.p 
      {...props}
      aria-live='polite'
      id={ ctx.error.id }
      priority='auxiliary'
      standby={ false }/>
  )
}

export const lockup = proxy<HTMLTagsOnly, LockupProps>('lockup', (TagName) => {
  return forwardRef<HTMLElement, LockupProps>(({
    icon: iconRef,
    children,
    subject,
    passiveMessage,
    errorMessage,
    ...props
  }: LockupProps, ref) => {

    const Element = box[TagName];


    return (
      <LockupProvider>
        <Element { ...restrictProps(props) } ref={ ref } gap>
          { getIcon(iconRef, subject as ReactElement) }
          <box.div stack gap stretch>
            <SubjectComponent>{ subject }</SubjectComponent>
            <PassiveComponent>{ passiveMessage }</PassiveComponent>
            <box.div stack gap stretch>
                <ErrorComponent>{ errorMessage }</ErrorComponent>
                { children }
            </box.div>
          </box.div>
        </Element>
      </LockupProvider>
    )

  })
});
