import { useCallback, useState, useMemo } from 'react';

function thresholdMatches(thresholds: number[], width: number) {
    return thresholds.reduce((acc: number[], threshold) => {
      return width <= threshold ? acc.concat(threshold) : acc ;
    }, []);
}

export type ReflowProp<P> = {
    reflow?: Record<number, P>
}

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