import {useCallback, DependencyList} from 'react';
import {useMountedState} from './useMountedState';

export type ProgressiveCallbackState = 'pending' | 'fulfilled' | 'rejected' | undefined;

export function useProgressiveCallback<T extends Function>(
    callback: T,
    deps: DependencyList,
): [ProgressiveCallbackState, T] {
    let [callbackState, setCallbackState] = useMountedState<ProgressiveCallbackState>(undefined);

    let enhancedCallback = useCallback<T>(
        // @ts-ignore the `args` type is the same as in `callback`
        (...args) => {
            try {
                let value = callback(...args);

                if (value instanceof Promise) {
                    setCallbackState('pending');
                    return value
                        .then(resolvedValue => {
                            setCallbackState('fulfilled');
                            return resolvedValue;
                        })
                        .catch(error => {
                            setCallbackState('rejected');
                            throw error;
                        });
                }
                else {
                    setCallbackState('fulfilled');
                    return value;
                }
            }
            catch (error) {
                setCallbackState('rejected');
                throw error;
            }
        },
        deps,
    );

    return [callbackState, enhancedCallback];
}
