import {useCallback, DependencyList} from 'react';
import {schedule, ScheduleOptions} from 'skdl';
import {isDependencyList} from './isDependencyList';
import {useMountedState} from './useMountedState';

export type ProgressiveCallbackState = 'pending' | 'fulfilled' | 'rejected' | undefined;
export type ProgressiveCallbackOptions<T> = ScheduleOptions<T>;

export function useProgressiveCallback<P extends any[], T>(
    callback: (...args: P) => Promise<T> | T,
    options?: ProgressiveCallbackOptions<T | undefined>,
    deps?: DependencyList,
): [ProgressiveCallbackState, (...args: P) => Promise<T | undefined>];

export function useProgressiveCallback<P extends any[], T>(
    callback: (...args: P) => Promise<T> | T,
    deps?: DependencyList,
): [ProgressiveCallbackState, (...args: P) => Promise<T | undefined>];

export function useProgressiveCallback<P extends any[], T>(
    callback: (...args: P) => Promise<T> | T,
    options?: ProgressiveCallbackOptions<T | undefined> | DependencyList,
    deps?: DependencyList,
): [ProgressiveCallbackState, (...args: P) => Promise<T | undefined>] {
    let [callbackState, setCallbackState] = useMountedState<ProgressiveCallbackState>(undefined);
    let scheduleOptions: ProgressiveCallbackOptions<T | undefined> | undefined;

    if (isDependencyList(options)) {
        deps = options;
        scheduleOptions = undefined;
    }
    else scheduleOptions = options;

    let enhancedCallback = useCallback(
        (...args: P): Promise<T | undefined> => {
            let progressiveCallback = schedule(callback, scheduleOptions);
            try {
                let value = progressiveCallback(...args);

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
            catch (error) {
                setCallbackState('rejected');
                throw error;
            }
        },
        deps ?? [],
    );

    return [callbackState, enhancedCallback];
}
