import {useState, useRef, useEffect, useCallback} from 'react';

export function useMountSafeState<S>(initialState: S): [S, (state: S) => void] {
    let [state, setState] = useState<S>(initialState);
    let mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    let setMountSafeState = useCallback((state: S): void => {
        if (mounted.current)
            setState(state);
    }, []);

    return [state, setMountSafeState];
}
