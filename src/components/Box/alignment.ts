type Placement = string | undefined;

export type AlignmentConfig = {
    distribute?: 'between' | 'around' | 'evenly';
    logical?: boolean,
    stack?: boolean,
    placeChildren?: Placement,
    placeSelf?: Placement,
}

export function alignmentStyle(config: AlignmentConfig) {
    const {
        distribute,
        logical,
        placeChildren,
        placeSelf, 
        stack
    } = config;

    const logicalChildren = logical ? updateLogical(placeChildren) : placeChildren;
    const alignChildren = [xChildren(logicalChildren), yChildren(logicalChildren)];

    if (stack) {
        alignChildren.reverse();
    }

    const logicalSelf = logical ? updateLogical(placeSelf) : placeSelf;
    const [marginInline, marginBlock] = [xSelf(logicalSelf), ySelf(logicalSelf)];

    return {
        alignItems: alignChildren[1],
        justifyContent: distribute ? `space-${distribute}` : alignChildren[0],
        ...marginInline,
        ...marginBlock
    }
}

function updateLogical(placement: Placement) {
    return typeof placement === 'string'
        ? placement.replace('left', 'start').replace('right', 'end')
        : placement;
}

function xChildren(placeChildren: Placement) {
    switch(placeChildren) {
        case 'top-start':
        case 'start':
        case 'bottom-start':
            return 'start';
        case 'top':
        case 'center':
        case 'bottom':
             return 'center';
        case 'top-end':
        case 'end':
        case 'bottom-end':
            return 'end';
        default:
            return placeChildren;
    }
}

function yChildren(placeChildren: Placement) {
    switch(placeChildren) {
        case 'top-start':
        case 'top':
        case 'top-end':
            return 'start';
        case 'start':
        case 'center':
        case 'end':
            return 'center';
        case 'bottom-start':
        case 'bottom':
        case 'bottom-end':
            return 'end';
        default:
            return placeChildren;
    }
}

function xSelf(placeSelf: Placement) {
    switch(placeSelf) {
        case 'top-start':
        case 'start':
        case 'bottom-start':
            return { marginInlineEnd: 'auto' };
        case 'top-end':
        case 'end':
        case 'bottom-end':
            return { marginInlineStart: 'auto' };
        case 'top':
        case 'center':
        case 'bottom':
            return { marginInline: 'auto' };
        default:
            return {};
    }
}

function ySelf(placeSelf: Placement) {
    switch(placeSelf) {
        case 'top-start':
        case 'top':
        case 'top-end':
            return { marginBlockEnd: 'auto' };
        case 'bottom-start':
        case 'bottom':
        case 'bottom-end':
            return { marginBlockStart: 'auto' };
        case 'start':
        case 'center':
        case 'end':
            return { marginBlock: 'auto' };
        default:
            return {};
    }
}