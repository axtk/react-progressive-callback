import {useState, useCallback, DependencyList} from 'react';
import {schedule, ScheduleOptions} from 'skdl';

function isDependencyList(value: unknown): value is DependencyList {
    return Array.isArray(value);
}

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
    let [callbackState, setCallbackState] = useState<ProgressiveCallbackState>();
    let actualOptions: ProgressiveCallbackOptions<T | undefined> | undefined;

    if (isDependencyList(options)) {
        deps = options;
        actualOptions = undefined;
    }
    else actualOptions = options;

    let enhancedCallback = useCallback(
        (...args: P): Promise<T | undefined> => {
            let progressiveCallback = schedule(callback, actualOptions);
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
