import {useState, useRef, useEffect, useCallback} from 'react';

export function useMountedState<S>(initialState: S): [S, (state: S) => void] {
    let [state, setState] = useState<S>(initialState);
    let mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    let setMountedState = useCallback((state: S): void => {
        if (mounted.current)
            setState(state);
    }, []);

    return [state, setMountedState];
}
