import {useCallback, DependencyList} from 'react';
import {useMountedState} from './useMountedState';

export type ProgressiveCallbackState = 'pending' | 'fulfilled' | 'rejected' | undefined;

export function useProgressiveCallback(
    callback: (...args: any[]) => any,
    deps: DependencyList,
): [ProgressiveCallbackState, typeof callback] {
    let [callbackState, setCallbackState] = useMountedState<ProgressiveCallbackState>(undefined);

    let enhancedCallback = useCallback<typeof callback>(
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
