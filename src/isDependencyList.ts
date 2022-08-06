import type {DependencyList} from 'react';

export function isDependencyList(value: unknown): value is DependencyList {
    return Array.isArray(value);
}
