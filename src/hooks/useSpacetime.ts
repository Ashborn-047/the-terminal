import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { spacetime } from '../lib/spacetime';

/**
 * Returns the SpacetimeDB service singleton.
 */
export function useSpacetimeDB() {
    return spacetime;
}

/**
 * Returns the current connection status to SpacetimeDB.
 */
export function useSpacetimeConnection() {
    return useSyncExternalStore(
        (onStoreChange) => spacetime.onUpdate(onStoreChange),
        () => spacetime.getIsConnected()
    );
}

/**
 * A hook to handle SpacetimeDB reducer calls with loading and error states.
 */
export function useSpacetimeReducer<T extends (...args: any[]) => Promise<any>>(
    reducerFunc: T
) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const call = useCallback(async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await reducerFunc(...args);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [reducerFunc]);

    return { call, isLoading, error };
}

/**
 * A hook that subscribes to SpacetimeDB data and re-renders on updates.
 */
export function useSubscription<T>(
    getDataFunc: () => T,
    deps: any[] = []
): T {
    const [data, setData] = useState<T>(getDataFunc());

    useEffect(() => {
        const unsubscribe = spacetime.onUpdate(() => {
            setData(getDataFunc());
        });
        return unsubscribe;
    }, [getDataFunc, ...deps]);

    return data;
}
