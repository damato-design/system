type Placement = string | undefined;

export type AlignmentConfig = {
    /** Applied similar to justify-content: space-*. */
    distribute?: 'between' | 'around' | 'evenly';
    /** Determines if the result to respect LTR/RTL languages. */
    logical?: boolean,
    /** Determines the orientation of children. */
    stack?: boolean,
    /** Sets the alignment of children within the box. */
    placeChildren?: Placement,
    /** Sets the alignment of the box in relation to its parent box. */
    placeSelf?: Placement,
}

/**
 * Generates CSS property values based on the given configuration.
 * 
 * @param {AlignmentConfig} config - Alignment configuration
 * @returns {React.CSSProperties} - Style object
 */
export function alignmentStyle(config: AlignmentConfig) {
    const {
        distribute,
        logical,
        placeChildren,
        placeSelf, 
        stack
    } = config;

    // Update the placements to logical if appropriate.
    const logicalChildren = logical ? updateLogical(placeChildren) : placeChildren;
    // Create tuple for possible children alignment strategy.
    const alignChildren = [xChildren(logicalChildren), yChildren(logicalChildren)];

    // If we expect children to stack, flip the given alignment values.
    if (stack) {
        alignChildren.reverse();
    }

    // Update the placements to logical if appropriate.
    const logicalSelf = logical ? updateLogical(placeSelf) : placeSelf;
    // Create tuple for possible self alignment strategy.
    const [marginInline, marginBlock] = [xSelf(logicalSelf), ySelf(logicalSelf)];

    // Return CSS property-value pairs.
    return {
        alignItems: alignChildren[1],
        justifyContent: distribute ? `space-${distribute}` : alignChildren[0],
        ...marginInline,
        ...marginBlock
    }
}

/**
 * Updates the placement enun to be logical.
 * 
 * @param {Placement} placement - A placement enum
 * @returns {Placement} - An updated placement enum
 */
function updateLogical(placement: Placement) {
    return typeof placement === 'string'
        ? placement.replace('left', 'start').replace('right', 'end')
        : placement;
}

/**
 * Determines the correct CSS value for horizontal alignment of children.
 * 
 * @param {Placement} placeChildren - A placement enum
 * @returns {String} - A value expected for the x-alignment CSS.
 */
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

/**
 * Determines the correct CSS value for vertical alignment of children.
 * 
 * @param {Placement} placeChildren - A placement enum
 * @returns {String} - A value expected for the y-alignment CSS.
 */
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

/**
 * Determines the correct CSS value for horizontal alignment of the box.
 * 
 * @param {Placement} placeSelf - A placement enum
 * @returns {String} - A value expected for the x-alignment CSS.
 */
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
        case 'top-center':
        case 'center':
        case 'bottom-center':
            return { marginInline: 'auto' };
        default:
            return {};
    }
}

/**
 * Determines the correct CSS value for vertical alignment of self.
 * 
 * @param {Placement} placeSelf - A placement enum
 * @returns {String} - A value expected for the y-alignment CSS.
 */
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
        case 'start-center':
        case 'center':
        case 'end-center':
            return { marginBlock: 'auto' };
        default:
            return {};
    }
}
