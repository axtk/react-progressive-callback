import {useState, useCallback} from 'react';
import {schedule, ScheduleOptions} from 'skdl';

export type ProgressiveCallbackState = 'pending' | 'fulfilled' | 'rejected' | undefined;
export type ProgressiveCallbackOptions<T> = ScheduleOptions<T>;

export function useProgressiveCallback<P extends any[], T>(
    callback: (...args: P) => Promise<T> | T,
    options?: ProgressiveCallbackOptions<T | undefined>,
): [ProgressiveCallbackState, (...args: P) => Promise<T | undefined>] {
    let [callbackState, setCallbackState] = useState<ProgressiveCallbackState>();

    let enhancedCallback = useCallback(
        (...args: P): Promise<T | undefined> => {
            let progressiveCallback = schedule(callback, options);
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
        [callback, options],
    );

    return [callbackState, enhancedCallback];
}
