import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebouncedLocalStorage<T=any>(
    key: string,
    initialValue: T,
    debounceMs = 800
): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setValue = useCallback((value: T) => {
        setStoredValue(value);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.warn('Storage write failed:', error);
                localStorage.removeItem(key);
            }
        }, debounceMs);
    }, [key, debounceMs]);

    useEffect(() => {
        try {
            const item = localStorage.getItem(key);
            if (item !== null) {
                const parsed = JSON.parse(item);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setStoredValue(parsed as T);
            }
        } catch {
            localStorage.removeItem(key);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [key]);

    return [storedValue, setValue];
}
