import {useCallback, DependencyList} from 'react';
import {useMountSafeState} from './useMountSafeState';

export function useProgressiveCallback<F extends Function, E = unknown>(
    callback: F,
    deps: DependencyList,
): [boolean | undefined, F, E | undefined] {
    let [pending, setPending] = useMountSafeState<boolean | undefined>(undefined);
    let [error, setError] = useMountSafeState<E | undefined>(undefined);

    let enhancedCallback = useCallback<F>(
        // @ts-ignore `args` are of the same type as in `callback`
        (...args) => {
            try {
                setError(undefined);

                let value = callback(...args);

                if (value instanceof Promise) {
                    setPending(true);

                    return value
                        .catch(error => {
                            setError(error);
                        })
                        .finally(() => {
                            setPending(false);
                        });
                }
                else {
                    setPending(false);

                    return value;
                }
            }
            catch (error) {
                setPending(false);
                setError(error as E);
            }
        },
        deps,
    );

    return [pending, enhancedCallback, error];
}
