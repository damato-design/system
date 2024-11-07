import {
    forwardRef,
    useLayoutEffect,
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

    return <ListboxContext.Provider {...props} value={value} />
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

export type ItemProps = ButtonProps & {
    id: string,
    value: any,
}

export type ItemsProps = [ItemProps, ...ItemProps[]];

export type ListboxProps = ElementProps
    & {
        activeDescendant?: string,
        onActiveDescendantChange: (id: string) => void,
        behavior?: 'listbox' | 'menu',
        rtl?: boolean,
        loop?: boolean,
        stack?: boolean,
        items: ItemsProps,
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

        useLayoutEffect(() => {
            if (!document) return;
            const onKeyDown = (ev: any) => {
                if (ev.target !== document.activeElement) return;
                if (ALL_KEYS.includes(ev.key)) ev.preventDefault();
                const id = activeDescendant || itemIds[0];
                const update = nextId(ev.key, id, itemIds, arrows, loop);
                typeof onActiveDescendantChange === 'function'
                    && onActiveDescendantChange(update);
            }

            document.documentElement.addEventListener('keydown', onKeyDown);
            return () => document.documentElement.removeEventListener('keydown', onKeyDown);
        }, [onActiveDescendantChange, itemIds, arrows, activeDescendant, loop]);

        return <Element
            {...restrictProps(props)}
            {...target}
            tabIndex={ !target.id ? 0 : undefined }
            onClick={ (ev) => !target.id && ev.currentTarget.focus() }
            role={behavior}
            ref={ref}
            className={clsx(css.listbox, { [css.visualfocus]: visualFocus })}
            style={styles}>
            {items.map((item) => {
                return (
                    <Button
                        {...item}
                        stretch
                        key={item.id}
                        icon={getIcon(behavior, item.id === activeDescendant) || item.icon}
                        aria-selected={item.id === activeDescendant}
                        role={behavior === 'menu' ? 'menuitem' : 'option'}
                        onPointerDown={(ev: any) => {
                            typeof item.onPointerDown === 'function'
                                && item.onPointerDown(ev);
                            typeof onActiveDescendantChange === 'function'
                                && onActiveDescendantChange(item.id);
                        }}
                        tabIndex={-1}>
                        {item.children || item.id}
                    </Button>
                )
            })}
        </Element>;
    })
});
