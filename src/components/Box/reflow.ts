import { useCallback, useState, useMemo, useRef } from 'react';

/**
 * Returns the matching thresholds for a given width.
 * 
 * @param {Array<Number>} thresholds - The possible "breakpoints" to check
 * @param {Number} width - The current width
 * @returns {Number} - The matching thresholds
 */
function minThreshold(thresholds: number[], width: number) {
    return thresholds.reduce((acc: number, threshold) => {
      return width <= threshold ? Math.min(threshold) : acc ;
    }, Infinity);
}

/**
 * Create a safe stringified version of an object to be used as a key.
 * 
 * @param {Object} obj - Object to be converted
 * @returns {String} - Stringified version
 */
function safeStringify(obj: object): string {
    const seen = new WeakSet();
    return JSON.stringify(obj, function (_k, v) {
        if (v === null) return null;
        const t = typeof v;
        if (t === 'string' || t === 'number' || t === 'boolean') return v;
        if (Array.isArray(v)) return v;
        if (t === 'object') {
        if (seen.has(v)) return;
            seen.add(v);
            return Object.getPrototypeOf(v) === Object.prototype ? v : undefined;
        }
  });
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
    const reflowWidths = useMemo(() => Object.keys(reflow).map(Number).filter(Number.isFinite), [reflow]);

    const ro = useRef<ResizeObserver | null>();

    const callbackRef = useCallback(($elem: HTMLElement | null) => {

        if (typeof ref === 'function') {
            ref($elem as R);
        } else if (ref) {
            (ref as React.MutableRefObject<R>).current = $elem as R;
        }

        if (!reflowWidths.length) return;

        if ($elem && !ro.current) {
            ro.current = new ResizeObserver(([entry]) => {
                requestAnimationFrame(() => {
                    setThreshold(minThreshold(reflowWidths, entry.contentRect.width));
                })
            });
            ro.current.observe($elem);
        }

        if (!$elem && typeof ro?.current?.disconnect === 'function') {
            ro.current.disconnect();
            ro.current = null;
        }

    }, [ro, reflowWidths, ref]);

    const mergedProps = useMemo(() => {
        return { ...props, ...(reflow?.[threshold] || {}), ref: callbackRef }
    }, [props, reflow, threshold, callbackRef]);
    
    const key = useMemo(() => {
        return safeStringify(mergedProps);
    }, [mergedProps]);

    return { key, ...mergedProps };
}
