import { useEffect, useRef, useReducer } from 'react';

export function useGlobalLiveTimer(): number {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  // eslint-disable-next-line react-hooks/purity
  const nowRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      nowRef.current = Date.now();
      forceUpdate();
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  return nowRef.current;
}
