import { useCallback, useState, useMemo } from 'react';

/**
 * Returns the matching thresholds for a given width.
 * 
 * @param {Array<Number>} thresholds - The possible "breakpoints" to check
 * @param {Number} width - The current width
 * @returns {Array<Number>} - The matching thresholds
 */
function thresholdMatches(thresholds: number[], width: number) {
    return thresholds.reduce((acc: number[], threshold) => {
      return width <= threshold ? acc.concat(threshold) : acc ;
    }, []);
}

export type ReflowProp<P> = {
    /** An object where the key is the pixel width threshold to apply the value as props. */
    reflow?: Record<number, P>
}

/**
 * A react hook to update the props based on the width of the component.
 * 
 * @param {Object} originalProps - The original props provided to the root component
 * @param {Record<Number, Object>} originalProps.reflow - An object where each key represents a pixel width where the value are props to be applied at that width
 * @param {Ref} ref - The React element reference
 * @returns {Object} - The new props to assign to the root component
 */
export function useReflow<R extends HTMLElement | null, P extends ReflowProp<P>>(originalProps: P, ref: React.Ref<R>) {
    const { reflow = {}, ...props } = originalProps;
    const [threshold, setThreshold] = useState(Infinity);
    const reflowWidths = useMemo(() => Object.keys(reflow).map(Number), [reflow]);

    const callbackRef = useCallback(($elem: HTMLElement | null) => {
        if (!$elem) return;

        if (typeof ref === 'function') {
            ref($elem as R);
        } else if (ref) {
            (ref as React.MutableRefObject<R>).current = $elem as R;
        }

        if (!reflowWidths.length) return;

        const observer = new ResizeObserver(([entry]) => {
            requestAnimationFrame(() => {
                const matches = thresholdMatches(reflowWidths, entry.contentRect.width);
                setThreshold(Math.min(...matches));
            })
        });
        observer.observe($elem);

    }, [reflowWidths]);

    const reflowProps = useMemo(() => {
        return thresholdMatches(reflowWidths, threshold)
        .reduce((acc, key) => Object.assign(acc, reflow[key]), props)
    }, [reflowWidths, threshold]);

    return { ref: callbackRef, ...reflowProps }
}
