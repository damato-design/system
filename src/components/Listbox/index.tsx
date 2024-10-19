import { Children, cloneElement, forwardRef, isValidElement, useCallback, useMemo, useEffect, useState } from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps } from '../Element';

const JUMP_KEYS = ['End', 'Home'];
const HORIZONTAL_KEYS = ['ArrowLeft', 'ArrowRight']
const VERTICAL_KEYS = ['ArrowUp', 'ArrowDown'];

// TODO: incorperate length
function nextIndex(key: string, index: number, length: number, arrows: string[]) {
    if (JUMP_KEYS.includes(key)) return JUMP_KEYS.indexOf(key) - 1;
    if (!arrows.includes(key)) return index;
    return index + (arrows.indexOf(key) % 2) * 2 - 1;
}

type ListboxProps = ElementProps
    & {
        anchorRef?: React.Ref<HTMLElement>,
        start?: number,
        rtl?: boolean,
        loop?: boolean,
        stack?: boolean,
    };

export const listbox = proxy<HTMLTagsOnly, ListboxProps>('listbox', (TagName) => {
    return forwardRef<HTMLElement, ListboxProps>(({
        anchorRef,
        stack,
        rtl,
        loop,
        start = 0,
        children,
        className,
        style,
        ...props
    }: ListboxProps, ref) => {

        const Element = element[TagName];
        const styles: React.CSSProperties = {
            flexDirection: stack ? 'column' : 'row'
        }

        const [visualFocus, setVisualFocus] = useState(false);
        const [index, setIndex] = useState(start);
        const arrows = useMemo(() => {
            if (stack) return VERTICAL_KEYS;
            return rtl
                ? HORIZONTAL_KEYS.toReversed()
                : HORIZONTAL_KEYS;
        }, [rtl, stack]);

        const onKeyDown = useCallback((ev: any) => {
            setIndex(nextIndex(ev.key, index, Children.count(children), arrows));
        }, [arrows, index, children]);

        const clones = useMemo(() => 
            Children.map(children, (child, idx) => 
                isValidElement(child) 
                && cloneElement(child, { 
                    tabIndex: idx === index ? 0 : -1,
                    onClick: (ev) => {
                        typeof child?.props?.onClick === 'function'
                            && child.props.onClick(ev);
                        setIndex(idx);
                    },
                    onKeyDown: (ev) => {
                        typeof child?.props?.onKeyDown === 'function'
                            && child.props.onKeyDown(ev);
                        if (ev.key === 'Tab') return;
                        ev.preventDefault();
                        onKeyDown(ev);
                    }
                } as ElementProps)
            ), [children, index]);

        useEffect(() => {
            if (typeof anchorRef === 'function' || !document) return;
            anchorRef?.current?.addEventListener('keydown', onKeyDown);
            setVisualFocus(anchorRef?.current === document.activeElement);
        }, [anchorRef])

        return <Element
            {...props}
            ref={ref}
            className={ clsx(css.listbox, {[css.visualfocus]: visualFocus}) }
            style={ styles }
            data-listbox>
                { anchorRef ? clones : children }
            </Element>;
    })
});
