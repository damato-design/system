import { 
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useCallback,
    useId,
    useMemo,
    useEffect,
    useState
} from 'react';
import clsx from 'clsx';
import css from './styles.module.css';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';

const JUMP_KEYS = ['End', 'Home'];
const HORIZONTAL_KEYS = ['ArrowLeft', 'ArrowRight']
const VERTICAL_KEYS = ['ArrowUp', 'ArrowDown'];
const ALL_KEYS = JUMP_KEYS.concat(HORIZONTAL_KEYS, VERTICAL_KEYS);

function nextIndex(
    key: string,
    id: string,
    itemIds: string[],
    arrows: string[],
    loop?: boolean): string | undefined {
    if (JUMP_KEYS.includes(key)) return itemIds.at(JUMP_KEYS.indexOf(key) - 1);
    if (!arrows.includes(key)) return;
    const index = itemIds.indexOf(id) + (arrows.indexOf(key) % 2) * 2 - 1;
    if (loop) return itemIds.at(index) ? itemIds.at(index) : itemIds.at(0);
    return itemIds[index];
}

type ListboxProps = ElementProps
    & {
        anchorRef?: React.Ref<HTMLElement>,
        behavior?: 'listbox' | 'menu',
        start?: number,
        rtl?: boolean,
        loop?: boolean,
        stack?: boolean,
    };

export const listbox = proxy<HTMLTagsOnly, ListboxProps>('listbox', (TagName) => {
    return forwardRef<HTMLElement, ListboxProps>(({
        anchorRef,
        behavior = 'listbox',
        stack = true,
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

        const listboxId = useId();
        const itemIds = Children.map(children, (_) => useId()) || [];

        const [visualFocus, setVisualFocus] = useState(false);
        const [activeDescendant, setActiveDescendant] = useState(itemIds[start]);

        const arrows = useMemo(() => {
            if (stack) return VERTICAL_KEYS;
            return rtl
                ? HORIZONTAL_KEYS.toReversed()
                : HORIZONTAL_KEYS;
        }, [rtl, stack]);

        const onKeyDown = useCallback((ev: any) => {
            if (ALL_KEYS.includes(ev.key)) ev.preventDefault();
            setActiveDescendant(nextIndex(ev.key, activeDescendant, itemIds, arrows, loop) || activeDescendant);
        }, [arrows, activeDescendant, children, loop]);

        const clones = useMemo(() =>
            Children.map(children, (child, idx) =>
                isValidElement(child)
                && cloneElement(child, {
                    id: itemIds[idx],
                    tabIndex: -1,
                    role: behavior === 'menu' ? 'menuitem' : 'option',
                    "aria-selected": itemIds[idx] === activeDescendant,
                    onPointerDown: (ev) => {
                        typeof child?.props?.onPointerDown === 'function'
                            && child.props.onPointerDown(ev);
                        ev.preventDefault();
                        setActiveDescendant(itemIds[idx]);
                    }
                } as ElementProps)
            ), [children, activeDescendant]);

        const onFocus = useCallback(() => setVisualFocus(true), []);
        const onBlur = useCallback(() => setVisualFocus(false), []);

        useEffect(() => {
            if (typeof anchorRef === 'function') return;
            const $anchor = anchorRef?.current;
            if (!$anchor) return;

            $anchor.addEventListener('keydown', onKeyDown);
            $anchor.addEventListener('focus', onFocus);
            $anchor.addEventListener('blur', onBlur);

            // Only if anchor is not itself
            $anchor.setAttribute('tabindex', '0');
            $anchor.setAttribute('aria-haspopup', behavior);
            $anchor.setAttribute('aria-controls', listboxId);
            $anchor.setAttribute('aria-owns', listboxId);
            () => {
                $anchor.removeEventListener('keydown', onKeyDown);
                $anchor.removeEventListener('focus', onFocus);
                $anchor.removeEventListener('blur', onBlur);
            };
        }, [anchorRef, behavior])

        useEffect(() => {
            if (typeof anchorRef === 'function') return;
            // Only if anchor is not itself
            anchorRef?.current?.setAttribute('aria-activedescendant', activeDescendant);
        }, [activeDescendant])

        const isSelf = {
            tabIndex: 0,
            onKeyDown,
            onFocus,
            onBlur,
            'aria-activedescendant': activeDescendant,
            onPointerDown: (ev: any) => ev.currentTarget.focus(),
        }

        return <Element
            {...restrictProps(props)}
            {...!anchorRef ? isSelf : {}}
            id={listboxId}
            role={behavior}
            ref={ref}
            className={clsx(css.listbox, { [css.visualfocus]: visualFocus })}
            style={styles}
            data-actions>
            {clones}
        </Element>;
    })
});
