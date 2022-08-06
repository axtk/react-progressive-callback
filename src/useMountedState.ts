import {useState, useRef, useEffect, useCallback} from 'react';

export function useMountedState<S>(initialState: S): [S, (state: S) => void] {
    let [state, setState] = useState<S>(initialState);
    let mounted = useRef(true);

    useEffect(() => {
        return () => {
            mounted.current = false;
        };
    }, []);

    let setStateSafely = useCallback((state: S): void => {
        if (mounted.current)
            setState(state);
    }, []);

    return [state, setStateSafely];
}
