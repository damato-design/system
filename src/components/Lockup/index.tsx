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
  output: { id: string }
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
  const outputId = useId();

  const value = {
    subject: { id: subjectId },
    passive: { id: passiveId },
    error: { id: errorId },
    output: { id: outputId },
    input: {
      'aria-labelledby': subjectId,
      'aria-describedby': [passiveId, errorId, outputId].join(' '),
    }
  }

  return <LockupContext.Provider { ...props } value={ value }/>
}


function getIcon(iconRef: string | undefined, subject: ReactElement<TextProps>) {
  if (!iconRef) return null;
  if (iconRef && !subject) return createElement(icon[iconRef]);
  const IconElement = icon[iconRef];
  const { children, ...props } = Object.assign({
    priority: 'secondary',
  }, subject.props);
  return <IconElement { ...props } />;
}

function getSpacer(iconRef: string | undefined, subject: ReactElement<TextProps>) {
  if (!iconRef) return null;
  const props: TextProps = {
    priority: subject?.props?.priority,
    children: ' ',
  };
  return <text.pre {...props}/>
}

export type LockupProps = BoxProps & {
  icon?: string,
  subject?: ReactElement<TextProps>,
  output?: ReactElement<TextProps> | ReactNode,
  passiveMessage?: ReactElement<TextProps> | string,
  errorMessage?: ReactElement<TextProps> | string,
};

function SubjectComponent(props: { children: ReactNode }) {
  const ctx = useLockup();
  if (!props.children) return null;
  return (
    <box.div
      { ...props }
      stretch
      id={ ctx.subject.id }
      standby={ false }/>
  )
}

function OutputComponent(props: { children: ReactNode }) {
  const ctx = useLockup();
  if (!props.children) return null;
  return (
    <text.span
      { ...props }
      aria-live='polite'
      id={ ctx.output.id }/>
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
    placeChildren,
    subject,
    output,
    passiveMessage,
    errorMessage,
    ...props
  }: LockupProps, ref) => {

    const Element = box[TagName];
    const isCritical = errorMessage ? 'system:critical' : undefined;

    const header = subject || output
      ? (
        <box.div gap stretch>
          <SubjectComponent>{ subject }</SubjectComponent>
          <OutputComponent>{ output }</OutputComponent>
        </box.div>
      ) : null;

    return (
      <LockupProvider>
        <Element { ...restrictProps(props) } placeChildren={ placeChildren } ref={ ref }>
          { getIcon(iconRef, subject as ReactElement) }
          { getSpacer(iconRef, subject as ReactElement) }
          <box.div stack gap stretch>
            { header }
            <PassiveComponent>{ passiveMessage }</PassiveComponent>
            <box.div stack gap stretch placeChildren={ placeChildren } mode={ isCritical }>
              <ErrorComponent>{ errorMessage }</ErrorComponent>
              { children }
            </box.div>
          </box.div>
        </Element>
      </LockupProvider>
    )

  })
});
