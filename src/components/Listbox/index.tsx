import { 
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useMemo,
    createContext,
    useContext
} from 'react';
import clsx from 'clsx';
import css from './styles.module.scss';
import { proxy, HTMLTagsOnly } from '../Element/proxy';
import { element, ElementProps, restrictProps } from '../Element';
import { Button, ButtonProps } from '../Button';

const JUMP_KEYS = ['End', 'Home'];
const HORIZONTAL_KEYS = ['ArrowLeft', 'ArrowRight']
const VERTICAL_KEYS = ['ArrowUp', 'ArrowDown'];
const ALL_KEYS = JUMP_KEYS.concat(HORIZONTAL_KEYS, VERTICAL_KEYS);

const ListboxContext = createContext(null);

export const useListbox = () => {
    const context = useContext(ListboxContext);
    return context || { anchor: {}, target: { id: undefined } };
};

export const ListboxProvider = (props: any) => {
    const targetId = useId();
    
    const value = {
        anchor: {
            // 'aria-haspopup': '',
            'aria-controls': targetId,
            'aria-owns': targetId,
        },
        target: { id: targetId }
    }
    
    return <ListboxContext.Provider { ...props } value={ value }/>
}

function getIcon(behavior: 'listbox' | 'menu', selected: boolean) {
    if (behavior !== 'listbox') return;
    return selected ? 'check_box' : 'check_box_outline_blank';
}

function nextId(
    key: string,
    id: string,
    itemIds: string[],
    arrows: string[],
    loop?: boolean): string {

    if (JUMP_KEYS.includes(key)) return itemIds.at(JUMP_KEYS.indexOf(key) - 1) || id;
    const direction = (arrows.indexOf(key) % 2) * 2 - 1;
    const index = itemIds.indexOf(id);
    const update = index + direction;
    if (direction === -3 || !~index) return id;
    if (!itemIds.at(index) && loop) return itemIds[0];
    return itemIds[update] || id;
}

type ItemProps = ButtonProps & {
    id: string,
    value: string,
}

export type ListboxProps = ElementProps
    & {
        activeDescendant?: string,
        onActiveDescendantChange: (id: string) => void,
        behavior?: 'listbox' | 'menu',
        rtl?: boolean,
        loop?: boolean,
        stack?: boolean,
        items: [ItemProps, ...ItemProps[]],
        visualFocus: boolean,
    };

export const listbox = proxy<HTMLTagsOnly, ListboxProps>('listbox', (TagName) => {
    return forwardRef<HTMLElement, ListboxProps>(({
        activeDescendant,
        onActiveDescendantChange,
        behavior = 'listbox',
        stack = true,
        items,
        rtl,
        loop,
        visualFocus,
        children: _,
        ...props
    }: ListboxProps, ref) => {

        const Element = element[TagName];
        const styles: React.CSSProperties = {
            flexDirection: stack ? 'column' : 'row'
        }

        const { target } = useListbox();
        const itemIds = useMemo(() => items.map(({ id }) => id), [items]);

        const arrows = useMemo(() => {
            if (stack) return VERTICAL_KEYS;
            return rtl
                ? HORIZONTAL_KEYS.toReversed()
                : HORIZONTAL_KEYS;
        }, [rtl, stack]);

        // TODO: Is there a way to improve render performance by dropping deps;
        // especially activeDescendant?
        const onKeyDown = useCallback((ev: any) => {
            if (ALL_KEYS.includes(ev.key)) ev.preventDefault();
            const id = activeDescendant || itemIds[0];
            const update = nextId(ev.key, id, itemIds, arrows, loop);
            typeof onActiveDescendantChange === 'function'
                && onActiveDescendantChange(update);
        }, [onActiveDescendantChange, itemIds, arrows, activeDescendant, loop]);

        const onPointerDown = useCallback((ev: any) => {
            ev.preventDefault();
            typeof onActiveDescendantChange === 'function'
                && onActiveDescendantChange(ev.currentTarget.id);
        }, [onActiveDescendantChange]);

        const onFocus = useCallback(() => (ev: any) => ev.currentTarget.focus(), []);

        useEffect(() => {
            if (!document || typeof target.id !== 'string') return;
            const $anchor = document.querySelector(`[aria-controls="${target.id}"]`);
            if (!$anchor) return;

            $anchor.addEventListener('pointerdown', onFocus);
            $anchor.addEventListener('keydown', onKeyDown);
            return () => {
                $anchor.removeEventListener('pointerdown', onFocus);
                $anchor.removeEventListener('keydown', onKeyDown);
            }
        }, [target.id]);

        const targetProps = !target.id ? {
            onPointerDown: onFocus,
            onKeyDown,
            tabIndex: 0,
        } : {};
        
        return <Element
            {...restrictProps(props)}
            { ...target }
            { ...targetProps }
            role={behavior}
            ref={ref}
            className={clsx(css.listbox, { [css.visualfocus]: visualFocus })}
            style={styles}>
            { items.map((item) => {
                return (
                    <Button 
                        { ...item}
                        stretch
                        key={ item.id }
                        icon={ getIcon(behavior, item.id === activeDescendant) }
                        aria-selected={ item.id === activeDescendant }
                        role={ behavior === 'menu' ? 'menuitem' : 'option' }
                        onPointerDown={ (ev: any) => {
                            typeof item.onPointerDown === 'function'
                                && item.onPointerDown(ev);
                            onPointerDown(ev);
                        } }
                        tabIndex={ -1 }>
                        { item.children || item.id }
                    </Button>
                )
            }) }
        </Element>;
    })
});
