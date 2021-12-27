import { useLayoutEffect, useRef } from "react"

export const useLayoutEffectOnUpdate = (effect: React.EffectCallback, deps?: React.DependencyList | undefined) => {
    const initialRender = useRef(true);

    useLayoutEffect(() => {
        if(initialRender.current) {
            initialRender.current = false;
        } else {
            effect();
        }
    }, deps)
}